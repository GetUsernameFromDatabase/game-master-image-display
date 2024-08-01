import { useAppSelector } from '@/app/store/hooks';
import { selectActiveImage } from '@/app/store/slices/table-slice';

export default function ViewImagePage() {
  const storeActiveImage = useAppSelector(selectActiveImage);
  const isImageEmpty = storeActiveImage === '';

  return (
    <div className='bg-black'>
      <img
      src={
        isImageEmpty
          ? 'https://www.publicdomainpictures.net/pictures/560000/velka/banaan-grappige-cartoon-png.png'
          : storeActiveImage
      }
      className='h-svh m-auto'
    ></img>
    </div>
  );
}
