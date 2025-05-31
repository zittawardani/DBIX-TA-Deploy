import { v4 as uuidv4 } from 'uuid';


const generateInvoiceId = () =>{
  const uuid = uuidv4()
  const cleanedUUID = uuid.replace(/-/g, '')
  const id = `TRX${cleanedUUID.substring(0, 12)}`
  return id.toUpperCase();
}

export default generateInvoiceId