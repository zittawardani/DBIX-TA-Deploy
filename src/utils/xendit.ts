import { Xendit } from 'xendit-node';

const xendit = new Xendit({
  secretKey: String(process.env.NEXT_PRIVATE_XENDIT_DEV_API_KEY,)
})

export default xendit