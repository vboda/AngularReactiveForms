import { Product } from "../product";
import * as fromRoot from "../../state/app.state";
import { createFeatureSelector, createSelector, State } from "@ngrx/store";
import { ProductActions, ProductActionTypes } from "./products.actions";


export interface State extends fromRoot.State{
    products:Product[]
}

export interface ProductState{
    showProductCode : boolean;
    currentProductId: number;
    error:string;
    products:Product[];

}

const initialState:ProductState = {
    showProductCode: true,
    currentProductId: null,
    products:[],
    error:''
}

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
)

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
)

export const getError = createSelector(
    getProductFeatureState,
    state=> state.error
)
export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
)
export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if(currentProductId === 0){
            return {
                id:0,
                productName:'',
                productCode:"New",
                description:'',
                starRating:0
                }
        } else{
            return currentProductId ? state.products.find(p=> p.id === currentProductId): null;
        }
    }
    )


export function reducer(state = initialState, action:ProductActions):ProductState{
    switch(action.type){

        case ProductActionTypes.ToggleProductCode:
            return {
                ...state,
                showProductCode:action.payload
            };
        case ProductActionTypes.SetCurrentProduct:
            return {
                ...state,
                currentProductId:action.payload.id
            };
        case ProductActionTypes.ClearCurrentProduct:
            return {
                ...state,
                currentProductId:null
            }
        case ProductActionTypes.InitializeCurrentProduct:
        return{
            ...state,
            currentProductId:0
        }

        case ProductActionTypes.LoadSuccess:
        return {
            ...state,
            products: action.payload,
            error:''
        }

        case ProductActionTypes.LoadFailure:
        return {
            ...state,
            products:[],
            error:action.payload
        }
        case ProductActionTypes.UpdateProductSuccess:
        const updatedProducts = state.products.map(
            item => action.payload.id === item.id ? action.payload: item
        );
        return {
            ...state,
            products: updatedProducts,
            currentProductId:action.payload.id,
            error:''
        }

        case ProductActionTypes.UpdateProductFail:
        return{
            ...state,
            error:action.payload
        }

        default:
            return state;
    }

}