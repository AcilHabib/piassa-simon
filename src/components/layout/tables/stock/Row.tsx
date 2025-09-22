'use client';
import AlertDialog from '@/components/models/AlertDialog';
import {cn} from '@/lib/utils';
import {CheckCheck, ChevronLeft, Eye, EyeClosed, PenLine, Trash2} from 'lucide-react';
import {FC, useState} from 'react';
import DisplayData from '../components/DisplayData';
import Details from './Details';
import Edit from './Edit';
import MoreOption from './MoreOption';
import {ArticleType} from '~/types';
import updateArticle from '@/lib/simon/requests/updateArticle';
import {excludedKeys, excludedKeys_edit, excludedKeys_row} from '@/lib/simon/exports';

interface RowProps {
  options: {
    edit: string;
    seeDetails: string;
    delete: string;
  };
  data: ArticleType;
}

const Row: FC<RowProps> = ({options, data}) => {
  // Filter the data using excludedKeys_edit
  const filteredData = Object.fromEntries(Object.entries(data).filter(([key]) => !excludedKeys_row.includes(key)));

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [moreOptions, setMoreOptions] = useState<'details' | 'edit' | null>(null);
  const [articleData, setArticleData] = useState(filteredData);

  const handleUpdateArticle = async () => {
    try {
      await updateArticle(data.id, articleData);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 transition-all duration-700 ease-in-out">
      <div className="flex w-full items-center">
        <div
          className={cn(
            'mt-2 w-[90%] bg-offWhite px-10 py-6 text-foreground transition-all duration-700 ease-in-out',
            showMoreOptions && '-translate-x-[30%] xl:-translate-x-[15%]'
          )}>
          <DisplayData data={articleData} />
        </div>
        <div
          className={cn(
            'relative flex w-[10%] items-center justify-center gap-2 transition-all duration-700 ease-in-out',
            showMoreOptions && '-translate-x-[250%] xl:-translate-x-60'
          )}>
          <button
            className="rounded bg-grayedout/50 p-4 mr-8 outline-primary backdrop-blur-2xl hover:bg-grayedout/70"
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
              setMoreOptions(null);
            }}>
            <ChevronLeft
              className={cn(
                'h-5 w-5 cursor-pointer transition-all duration-700 ease-in-out xl:h-8 xl:w-8',
                showMoreOptions && '-scale-95'
              )}
              width={32}
              height={32}
              aria-label="Plus Info"
            />
          </button>
          {/* more options */}
          <div
            className={cn(
              'invisible absolute -right-48 top-0 flex items-center justify-center gap-4 opacity-0 transition-all duration-300 ease-in-out',
              showMoreOptions && 'visible opacity-100'
            )}>
            <MoreOption
              title={options.edit}
              Icon={moreOptions !== 'edit' ? PenLine : CheckCheck}
              onClick={() => {
                if (moreOptions === 'edit') {
                  handleUpdateArticle();
                }
                setMoreOptions((prev) => (prev === 'edit' ? null : 'edit'));
              }}
            />
            <MoreOption
              title={options.seeDetails}
              Icon={moreOptions !== 'details' ? EyeClosed : Eye}
              onClick={() => setMoreOptions((prev) => (prev === 'details' ? null : 'details'))}
            />
            <AlertDialog
              title="Are you sure you want to delete this product (AMK43210) ?"
              description="This action cannot be undone. If there are any pending orders for this product, they will be canceled. And for the orders already placed, they will be related to an anonymous product."
              callToAction="Delete"
              onConfirm={() => {}}
              Icon={{
                icon: Trash2,
                iconBorderColor: 'red-500/50',
                iconColor: 'red-500',
              }}
              Trigger={<MoreOption title={options.delete} Icon={Trash2} onClick={() => {}} />}
              type="distructive"
            />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'invisible h-0 w-[90%] opacity-0 transition-all duration-700 ease-in-out',
          moreOptions !== null && 'visible h-96 opacity-100',
          moreOptions === 'edit' && 'h-96'
        )}>
        {moreOptions === 'details' && <Details data={articleData} />}
        {moreOptions === 'edit' && <Edit data={articleData} setData={setArticleData} />}
      </div>
    </div>
  );
};

export default Row;
