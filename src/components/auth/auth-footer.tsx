"use client";

import i18next from "i18next";
import {
  useTranslation,
  useTranslation as useTranslationI18N,
} from "react-i18next";

import { useRouter } from "@/lib/hooks/use-router";
import { languages } from "@/lib/i18n/settings";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const labels = {
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ms: "Bahasa Melayu",
  pl: "Polski",
  pt: "Português",
  ru: "Русский",
  th: "ไทย",
  tr: "Türkçe",
  vi: "Tiếng Việt",
  zh: "中文",
};

export const AuthFooter = () => {
  const { i18n } = useTranslationI18N();
  const { t } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();

  const handleChangeLanguage = (value: string) => {
    i18next.changeLanguage(value);
    router.refresh();
  };

  return (
    <div className="py-4">
      <Select
        onValueChange={(value) => handleChangeLanguage(value)}
        value={currentLocale}
      >
        <SelectTrigger className="mx-auto !w-auto border-transparent bg-transparent focus:ring-transparent">
          {currentLocale ? t(currentLocale) : "Select language"}
        </SelectTrigger>

        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {labels?.[lang as keyof typeof labels]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
