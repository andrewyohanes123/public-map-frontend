import { FC, ReactElement } from "react"
import { Dialog } from "primereact/dialog"
import { useState } from "react"
import { MangroveTypeAttributes, RawMangroveAmountAttributes } from "../types/Types";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ModelsContext } from "../contexts/ModelsContext";
import { useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import MangroveAmountCard from "./MangroveAmountCard";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useMemo } from "react";

interface props {
  surface_area: number;
  preview?: boolean;
  point_id?: number;
}

const AddMangroveAmount: FC<props> = ({ surface_area, preview, point_id }): ReactElement => {
  const [dialog, toggleDialog] = useState<boolean>(false);
  const [amount, setAmount] = useState<MangroveTypeAttributes[]>([]);
  const { models } = useContext(ModelsContext);
  const { MangroveType, MangroveAmount } = models!;
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);

  const getAmount = useCallback(() => {
    MangroveType.collection({
      attributes: ['name'],
      include: [{
        model: 'MangroveAmount',
        attributes: ['amount', 'mangrove_type_id', 'point_id', 'id'],
        where: {
          point_id: preview ? point_id : id
        },
        // @ts-ignore
        required: typeof preview !== 'undefined'
      }]
    }).then(resp => {
      setAmount(resp.rows as MangroveTypeAttributes[]);
    }).catch(e => {
      alert(e.toString());
    })
  }, [id, MangroveType, preview, point_id]);

  useEffect(() => {
    getAmount();
  }, [getAmount]);

  const createMangroveAmount = useCallback((mangrove_type_id: number) => {
    MangroveAmount.create({
      mangrove_type_id,
      point_id: id,
      amount: 0
    }).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Jumlah berhasil ditambah', });
      console.log(resp);
      getAmount();
    }).catch(e => {
      toast.current?.show({ severity: 'danger', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [MangroveAmount, id, getAmount]);

  const amounts: number[] = useMemo<number[]>(() =>
  (amount.length > 0 ? amount
    .filter(amount => amount.mangrove_amounts.length > 0)
    .map(amount => amount.mangrove_amounts[0].amount)
    : [])
    , [amount]);

  const totalAmount: number = useMemo(() => ((amounts.length > 0 ? amounts.reduce((a, b) => (a + b)) : 0) / surface_area), [amounts, surface_area]);

  const totalAmountRelative: number = useMemo(() => (totalAmount / amount.filter(amt => amt.mangrove_amounts.length > 0).length), [totalAmount, amount]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog dismissableMask={false} modal={false} visible={dialog} header="Populasi pohon" style={{ width: '50vw' }} onHide={() => toggleDialog(false)}>
        {
          amount.map(amt => (
            <Card key={`${amt.id}${amt.name}`} title={amt.name} className="p-my-2">
              {
                amt.mangrove_amounts.length === 0 ?                
                  <Button label="Masukkan jumlah" onClick={() => createMangroveAmount(amt.id)} className="p-fluid" />
                  :
                  amt.mangrove_amounts.map((mangrove: RawMangroveAmountAttributes) => (
                    <MangroveAmountCard preview={true} key={mangrove.id} mangrove_amount={mangrove} mangrove_type={amt} onUpdateAmount={getAmount} />
                  ))
              }
            </Card>
          ))
        }
      </Dialog>
      <div style={{
        background: 'var(--surface-600)',
        borderRadius: 8,
        cursor: 'pointer',
      }}
        onClick={() => toggleDialog(true)}
        className="p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center"
      >

        <div style={{
          background: 'var(--surface-500)',
          width: '100%',
          borderRadius: 8,
        }}
          className="p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center">
          <h4 className="color-text">Kerapatan Jenis (Ind/Ha)</h4>
          <p>{totalAmount.toFixed(3)}%</p>
        </div>
        <div style={{
          background: 'var(--surface-500)',
          width: '100%',
          borderRadius: 8,
        }}
          className="p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center">
          <h4 className="color-text">Kerapatan relatif (%)</h4>
          <p>{totalAmountRelative.toFixed(3)}%</p>
        </div>
        <p style={{ userSelect: 'none' }} className="p-mt-3">
        {!preview ?
          <small className="secondary-texy">Klik di sini untuk mengubah data</small>
          :
          <small className="secondary-texy">Klik di sini untuk data lanjutan</small>
        }
        </p>
      </div>
    </>
  )
}

export default AddMangroveAmount
