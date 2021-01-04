import { TemplateResult } from 'lit-html';
export declare type Link = ({ classname, params, route, text, }: {
    classname?: string;
    params?: any;
    route: string;
    text: string;
}) => TemplateResult;
