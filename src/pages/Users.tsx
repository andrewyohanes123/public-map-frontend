import { FC, ReactElement, lazy, Suspense, useState, useContext, useEffect, useCallback, useRef, MouseEvent } from 'react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { confirmPopup } from 'primereact/confirmpopup'
import { ModelsContext } from '../contexts/ModelsContext';
import { User } from '../types/Types';

const AddUser = lazy(() => import('../components/AddUser').then(m => ({ default: m.AddUser })));

export const Users: FC = (): ReactElement => {
  const [addUser, toggleAddUser] = useState<boolean>(false);
  const [users, setUsers] = useState<{ count: number; rows: User[] }>({ rows: [], count: 0 });
  const [user, setUser] = useState<User | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, toggleLoading] = useState<boolean>(true);
  const { models } = useContext(ModelsContext);
  const { User } = models!;
  const toast = useRef<Toast>(null);

  document.title = "Dashboard - Pengguna"

  const getUsers = useCallback(() => {
    toggleLoading(true);
    User.collection({
      attributes: ['name', 'username', 'type'],
    }).then(resp => {
      toggleLoading(false);
      setUsers({ rows: resp.rows as User[], count: resp.count });
    }).catch(e => {
      toggleLoading(false);
      toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 3000 });
    })
  }, [User, toast]);

  const createUsers = useCallback((values: any, cb: () => void) => {
    User.create(values).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Pengguna berhasil dibuat', detail: `Pengguna ${resp.name} berhasil dibuat`, life: 1500 });
      getUsers();
      cb();
      toggleAddUser(false);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 3000 });
    })
  }, [toast, getUsers, User]);

  useEffect(() => {
    getUsers();
    // eslint-desable-next-line
  }, [getUsers]);

  const deleteUser = useCallback((user: User) => {
    user.delete().then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Pengguna berhasil dihapus', detail: `Pengguna ${resp.name} berhasil dihapus`, life: 3000 });
      getUsers();
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 3000 });
    })
  }, [getUsers]);

  const updateUser = useCallback((values: any, cb: () => void) => {
    if (typeof user !== 'undefined') {
      user.update({ ...values }).then(resp => {
        getUsers();
        cb();
        toggleAddUser(false);
        toast.current?.show({ severity: 'success', summary: 'Data pengguna berhasil disimpan', detail: `Pengguna ${resp.name} berhasil diubah`, life: 3000 });
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 3000 });
      })
    }
  }, [user, getUsers]);

  const confirmDelete = useCallback((e: MouseEvent<HTMLButtonElement>, row: User) => {
    confirmPopup({
      target: e.currentTarget,
      message: `Apakah Anda yakin ingin menghapus pengguna ${row.name}?`,
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: () => deleteUser(row),
      acceptClassName: 'p-button-danger'
    })
  }, [deleteUser]);

  const actionBody = useCallback((row: User): ReactElement => (
    <>
      <Tooltip target={`#editBtn${row.id}`} position="left" content={`Edit ${row.name}`} />
      <Tooltip target={`#delBtn${row.id}`} position="left" content={`Hapus ${row.name}`} />
      <Button id={`editBtn${row.id}`} icon="pi pi-fw pi-user-edit"
        onClick={() => setUser(row)}
        className="p-button-sm p-mr-2 p-button-warning" />
      <Button id={`delBtn${row.id}`} onClick={e => confirmDelete(e, row)} icon="pi pi-fw pi-trash" className="p-button-sm p-button-danger" />
    </>
  ), [confirmDelete]);

  useEffect(() => {
    (typeof user !== 'undefined') && toggleAddUser(true);
  }, [user]);

  useEffect(() => {
    (!addUser) && setUser(undefined);
  }, [addUser])

  return (
    <div className="p-mt-3 p-pl-2 p-pr-2">
      <Toast ref={toast} />
      <Button onClick={() => toggleAddUser(true)} label="Tambah Pengguna" />
      <Divider />
      <Suspense fallback={<></>}>
        <AddUser visible={addUser} user={user} onHide={() => toggleAddUser(false)} onSubmit={typeof user !== 'undefined' ? updateUser : createUsers} />
      </Suspense>
      <DataTable
        value={users.rows}
        rows={limit}
        paginator
        emptyMessage="Belum ada pengguna"
        first={page}
        onPage={e => setPage(e.first)}
        totalRecords={users.count}
        loading={loading}
      >
        <Column field="name" header="Nama Lengkap" />
        <Column field="username" header="Username" />
        <Column field="type" header="Tipe Pengguna" />
        <Column header="Edit | Hapus" body={actionBody} />
      </DataTable>
    </div>
  )
}
