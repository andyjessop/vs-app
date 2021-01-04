import { TemplateResult } from 'lit-html';

export type Link = ({
  classname,
  params,
  route,
  text,
}: {
  classname?: string;
  params?: any;
  route: string;
  text: string;
}) => TemplateResult;
