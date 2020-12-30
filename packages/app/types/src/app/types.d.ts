import { Container } from '@crux/di';
export interface Layout {
    update(container: Container.API): Promise<void> | void;
}
