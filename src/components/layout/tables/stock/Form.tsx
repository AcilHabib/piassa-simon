import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Plus} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC, useTransition} from 'react';

interface FormProps {
  locale: string;
}

const Form: FC<FormProps> = ({locale}) => {
  const t = useTranslations('stockPage.articles');
  return (
    <div className="flex w-full flex-col gap-6 pb-8 pt-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* general info */}
      <div className="h-fit w-full rounded-md bg-gray-100 p-2">
        {/* <h1 className="text-2xl font-bold">{productInfo.generalInfo.title}</h1> */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className=" col-span-2">
            <span className="text-subtle">{t('designation')}</span>
            <Input className="shadow-md" placeholder="" />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-full">
            <span className="text-subtle">{t('refAM')}</span>
            <Input className="shadow-md" placeholder="" />
          </div>
          <div className="h-full">
            {/* <label className="text-subtle">{productInfo.generalInfo.Qnt}</label> */}
            <Input className="shadow-md" placeholder="2" type="number" min={0} max={3} />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-full">
            <span className="text-subtle">{t('position')}</span>
            <Input className="shadow-md" placeholder="" />
          </div>
          <div className="h-full">
            <span className="text-subtle">{t('type')}</span>
            <Input className="shadow-md" placeholder="" />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2"></div>
        {/* <Select onValueChange={handleSelectLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  localeTolanguage[locale as keyof typeof localeTolanguage]
                }
              />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(localeTolanguage).map((value) => (
                <SelectItem value={value} key={value}>
dddd
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div> */}
      </div>
      {/* <div className="h-fit w-full rounded-md bg-gray-100 p-2">
        <h1 className="text-2xl font-bold">{productInfo.tecDocInformation.title}</h1>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-full">
            <span className="text-subtle">{productInfo.tecDocInformation.OEM}</span>
            <Input disabled className="shadow-md" placeholder="Ev AMK43210 Spark" />
          </div>
          <div className="">
            <span className="text-subtle">{productInfo.tecDocInformation.technicalName}</span>
            <Input disabled className="shadow-md" placeholder="Ev AMK43210 Spark" />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="col-span-2 h-full">
            <span className="text-subtle">{productInfo.tecDocInformation.category}</span>
            <Input disabled className="shadow-md" placeholder="Motors" />
          </div>
        </div>
      </div>
      <div className="h-fit w-full rounded-md bg-gray-100 p-2">
        <h1 className="text-2xl font-bold">{productInfo.prices.title}</h1>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-full">
            <span className="text-subtle">{productInfo.prices.retailPrice}</span>
            <Input className="shadow-md" placeholder="1000 DA" />
          </div>
          <div className="">
            <span className="text-subtle">Price 2</span>
            <Input className="shadow-md" placeholder="1000 DA" />
          </div>
        </div>
        <div className="flex cursor-pointer items-center justify-end gap-2 p-2 pt-4 font-semibold">
          {productInfo.prices.addPrice}
          <Plus className="h-4 w-4 text-subtle" />
        </div>
      </div> */}
      {/* <div className="flex justify-end gap-3">
        <Button className="px-8" variant={'secondary'}>
          Cancel
        </Button>
        <Button className="px-8">Create</Button>
      </div> */}
    </div>
  );
};

export default Form;
