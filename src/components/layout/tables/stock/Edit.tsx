'use client';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ImagePlus} from 'lucide-react';
import Image from 'next/image';
import {FC, useState} from 'react';
import {Input} from '@/components/ui/input';
import {excludedKeys_edit} from '@/lib/simon/exports';
import {useTranslations} from 'next-intl';
import {ArticleType} from '~/types';

interface EditProps {
  data: ArticleType;
  setData: (data: ArticleType) => void;
}

const Edit: FC<EditProps> = ({data, setData}) => {
  const t = useTranslations('stockPage.addProduct');
  const [showImage] = useState(true);

  // Create a state object to manage input changes
  const [formData, setFormData] = useState(data);

  // Handle input change
  const handleInputChange = (key: string, value: string) => {
    const updatedData = {
      ...formData,
      [key]: value,
    };
    setFormData(updatedData);
    setData(updatedData);
  };

  return (
    <div className="flex w-full gap-2 bg-white text-black">
      {/* the picture */}
      <div
        className={`flex w-[50%] bg-[url(${
          data?.image || '/defaults/article.webp'
        })] items-center bg-cover bg-center justify-center p-2`}></div>
      {/* The creation Form */}
      <ScrollArea className="w-full">
        <div className="w-full px-8 grid grid-cols-2 flex-col gap-6 pb-8 pt-2">
          {Object.entries(formData)
            .filter(([key]) => !excludedKeys_edit.includes(key))
            .map(([key, value]) => (
              <div className="h-full" key={key}>
                <span className="text-subtle">{t(key)}</span>
                <Input
                  className="shadow-md"
                  value={String(value)}
                  placeholder=""
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Edit;
