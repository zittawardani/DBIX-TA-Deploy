import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from '../card';
import { Skeleton } from '../skeleton';

const SkeletonGrid = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length: length }, (v, i) => (
        <Card className='flex flex-col justify-between' key={i}>
          <div>
            <CardHeader>
              <Skeleton className='w-full h-36'/>
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className='w-full h-2'/>
              <Skeleton className='w-full h-1'/>
              <Skeleton className='w-full h-1'/>
              <Skeleton className='w-full h-1'/>
              <Skeleton className='w-full h-1'/>
            </CardContent>
          </div>
          <CardFooter className='flex items-center justify-between gap-10'>
              <Skeleton className='w-1/2 h-2'/>
              <Skeleton className='w-1/2 h-5'/>
          </CardFooter>
        </Card>
      ))}
    </>
  )
};

export default SkeletonGrid;