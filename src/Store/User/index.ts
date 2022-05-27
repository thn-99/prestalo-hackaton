import { atom } from "jotai";

export interface User {
    id:string,
    email:string;
    wallet_id:string;
    wallet_amount:number;
}

export const userAtom = atom( undefined as unknown as User );

export const userReadWriteAtom = atom((get)=>get(userAtom),(get,set,newUser:User)=>{
    set(userAtom, newUser);
})