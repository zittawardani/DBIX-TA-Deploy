import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { ProductDataType } from '@/types/productDataTypes';
import Link from 'next/link';
import { Button } from '../button';
import formattedPrice from '@/utils/formattedPrice';

type Props = {
  data: ProductDataType;
  load?: boolean;
};

const CardProduct = ({ data }: Props) => {
  const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6at7RwZOM_yVpsUZWimO0o75bYbKAE1DaTg&s';
  const imageUrl = (data.image && data.image.length > 0 && data.image[0]) ? data.image[0] : defaultImage;
  const productUrl = data.name ? `/products/details/${data.code_product}` : '#';

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <img src={imageUrl} alt={data.name || 'Product Image'} className="w-full h-36 object-cover rounded-md" />
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle className="leading-snug first-letter:uppercase">
            {data.name || 'Unnamed Product'}
          </CardTitle>
          <CardDescription className="text-xs first-letter:uppercase" dangerouslySetInnerHTML={{ __html: data.desc || 'No description available.' }} />
        </CardContent>
      </div>
      <CardFooter className="flex lg:items-center items-start lg:flex-row flex-col gap-3 justify-between">
        <p className="font-medium text-xs">
          {formattedPrice.toIDR(data.price)}
        </p>
        <Link href={productUrl}>
          <Button size="sm" className="font-medium" disabled={!data.name}>
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardProduct;
