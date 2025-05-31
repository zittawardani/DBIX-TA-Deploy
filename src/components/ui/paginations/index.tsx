import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '../button';

const PaginationComponent = () => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious size={'sm'} />
        </PaginationItem>
        <PaginationItem>
          <Button size={'sm'} variant={'link'}>1</Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size={'sm'} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>

  );
};

export default PaginationComponent;