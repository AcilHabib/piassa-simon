'use client';
import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';
import {ImagePlus, Plus} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {FC} from 'react';
import Form from './Form';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useStockContext} from '@/contexts/Stock';

const AddProductBtn = () => {
  const locale = useLocale();
  const {currentTab} = useStockContext();
  const t = useTranslations('stockPage.addProduct');
  const handleCreateNewProduct = async () => {
    // todo: to be implemented when the backend is ready
  };
  const chooseTitle = () => {
    switch (currentTab) {
      case 'all':
        return;
      case 'parts':
        return t('titlePart');
      case 'bodies':
        return t('titleBody');
      case 'glazes':
        return t('titleGlaze');
      case 'tires':
        return t('titleTire');
    }
  };

  if (currentTab !== 'all')
    return (
      <div className="flex  w-full items-center ">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                'flex gap-2 w-full text-white xl:px-4 xl:py-6 xl:text-lg',
                locale === 'ar' && 'flex-row-reverse'
              )}>
              {chooseTitle()}
              <Plus className="h-4 w-4 xl:h-5 xl:w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-max">
            <div className="flex w-[60vw] max-w-7xl gap-1 xl:gap-2">
              <div className="flex w-[50%] items-center justify-center rounded-md bg-offWhite p-1 xl:p-2">
                {/* //todo: show empty picture if no image is provided or gotten from tecdoc API */}
                <div className="flex h-full w-full items-center justify-center rounded-md p-1 xl:p-2">
                  <ImagePlus className="h-12 w-12 stroke-1 text-subtle/80 xl:h-16 xl:w-16" aria-label="Plus Info" />
                </div>
              </div>
              <ScrollArea className="max-h-[50rem] w-full">
                <div className="w-full">
                  <Form locale={locale} />
                  <div className="flex justify-end gap-3">
                    <DialogClose>
                      <Button className="px-8" variant={'secondary'}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button className="px-8" onClick={handleCreateNewProduct}>
                      {t('add')}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  else return <></>;
};

export default AddProductBtn;
