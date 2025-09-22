import {FC} from 'react';
import TableHead from './TableHead';
import {ScrollArea} from '@/components/ui/scroll-area';
import {TableHeadTitleType, TableLayoutProps} from '~/types';

const TableLayout: FC<TableLayoutProps> = ({titles, children}) => {
  return (
    <div className="relative h-full flex-1">
      <TableHead titles={titles} />
      <ScrollArea className="h-fit w-full">
        <div className="h-[80dvh]">{children}</div>
      </ScrollArea>
    </div>
  );
};

export default TableLayout;
