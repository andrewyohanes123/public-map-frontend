import { FC, ReactElement, useState, useEffect, useCallback, useContext } from "react"
import { InputNumber } from 'primereact/inputnumber'
import { RawMangroveAmountAttributes, MangroveTypeAttributes } from "../types/Types"
import { Button } from "primereact/button";
import { ModelsContext } from "../contexts/ModelsContext";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface props {
  mangrove_type: MangroveTypeAttributes;
  mangrove_amount: RawMangroveAmountAttributes;
  onUpdateAmount?: () => void;
  preview?: boolean;
}

const MangroveAmountCard: FC<props> = ({ mangrove_amount, onUpdateAmount, preview }): ReactElement => {
  const [amount, setAmount] = useState<number>(0);
  const { models } = useContext(ModelsContext)
  const { MangroveAmount } = models!;
  const toast = useRef<Toast>(null);

  useEffect(() => {
    setAmount(mangrove_amount.amount);
  }, [mangrove_amount]);

  const updateAmount = useCallback(() => {
    MangroveAmount.single(mangrove_amount.id).then(mangrove => {
      mangrove.update({ amount }).then(resp => {
        onUpdateAmount && onUpdateAmount();
        toast.current?.show({ severity: 'success', summary: 'Perubahan data berhasil', detail: `Data pohon berhasil diubah menjadi ${resp.amount}` });
      }).catch(e => {
        toast.current?.show({ severity: 'success', summary: 'Terjadi kesalahan', detail: e.toString() })
      })
    }).catch(e => {
      toast.current?.show({ severity: 'success', summary: 'Terjadi kesalahan', detail: e.toString() })
    })
  }, [amount, MangroveAmount, mangrove_amount, onUpdateAmount]);

  return (
    preview ?
    <div>
      {amount} pohon
    </div>
    :
    <div className="p-d-flex p-jc-between p-ai-center">
      <Toast ref={toast} />      
      <div className="p-d-block">        
        <InputNumber value={amount} suffix=" pohon" onChange={({ value }) => setAmount(value)} />
      </div>
      <div>
        <Button icon="pi pi-check" onClick={updateAmount} label="Simpan perubahan" disabled={mangrove_amount.amount === amount} />
      </div>
    </div>
  )
}

export default MangroveAmountCard
