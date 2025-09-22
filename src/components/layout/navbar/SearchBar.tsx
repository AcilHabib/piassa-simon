"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/i18n/routing";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  placeholer: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholer }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();
  const q = searchparams.get("q") || "";
  const [searchValue, setSearchValue] = useState(q);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(`${pathname}?q=${e.target.value}`);
  };
  const handleSearchDebounce = debounce(handleSearch, 500);
  const _handleSearchDebounce = useCallback(handleSearchDebounce, [
    pathname,
    handleSearchDebounce,
  ]);

  useEffect(() => {
    setSearchValue(q);
  }, [pathname, q]);
  return (
    <div className="w-full">
      <div className="flex w-3/5 max-w-lg items-center gap-2 rounded-md bg-black/50 px-3 py-1 backdrop-blur-2xl">
        <div className="flex h-7 w-7 rounded-md bg-primary p-1">
          <Image
            src="/logos/piassa-logo-minimal.svg"
            alt="Piassa Logo"
            width={1000}
            height={1000}
          />
        </div>
        <span className="h-5 border-l border-white border-opacity-50" />
        <Input
          className="border-none bg-transparent p-0 text-lg text-white ring-0 ring-offset-0 placeholder:text-white focus:border-0 focus:border-none focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={placeholer}
          // defaultValue={searchValue}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            _handleSearchDebounce(e);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
