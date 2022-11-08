import { IAppConfig, IResource } from "./AppInterfaces";
import { PaginationModel } from "./PaginationModel";

/* Declare state */
export interface AppState {
    appTitle:        string;
    toast:           Toast;
    loading:         boolean;
    shopUri:         string;
    shopApiKey:      string;
    data:            PaginationModel<IResource>;
    filtering:       IFiltering;
    additional:      { ip: string };
    config?:         IAppConfig;
}

export interface Toast {
    message: string;
    isOpen: boolean;
}

export interface IFiltering {
    status:         number | null;
    resourceId:     string;
    checkoutId:     string;
    orderName:      string;
}