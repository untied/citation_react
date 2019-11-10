import { IAuthorRecord, ICitationRecord } from '../database/database';
import { DataBase } from '../database/database';

export class API {
    // authorize a user with the specified login and password
    public static authorize(login: string, passw: string): Promise<boolean> {
        return new Promise<any>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.authorize(login, passw));
        });
    }

    // get a list of all authors
    public static getAuthors(): Promise<IAuthorRecord[]> {
        return new Promise<any>((resolve: (value?: IAuthorRecord[]) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getAuthors());
        });
    }

    // find an author by the specified id
    public static findAuthor(id: number): Promise<IAuthorRecord | null> {
        return new Promise<any>((resolve: (value?: IAuthorRecord | null) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findAuthor(id));
        });
    }

    // remove an author by the specified id
    public static deleteAuthor(id: number): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteAuthor(id));
        });
    }

    // create a new author having the specified parameters
    public static createAuthor(firstName: string, lastName: string, dateOfBirth: Date): Promise<number> {
        return new Promise<number>((resolve: (value?: number) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createAuthor(firstName, lastName, dateOfBirth));
        });
    }

    // update author's data by the specified id
    public static updateAuthor(id: number, firstName: string, lastName: string, dateOfBirth: Date): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.updateAuthor(id, firstName, lastName, dateOfBirth));
        });
    }

    // get a list of all citations
    public static getCitations(): Promise<ICitationRecord[]> {
        return new Promise<any>((resolve: (value?: ICitationRecord[]) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getCitations());
        });
    }

    // find a citation by the specified id
    public static findCitation(id: number): Promise<ICitationRecord | null> {
        return new Promise<any>((resolve: (value?: ICitationRecord | null) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findCitation(id));
        });
    }

    // remove a citation by the specified id
    public static deleteCitation(id: number): Promise<boolean> {
        return new Promise<any>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteCitation(id));
        });
    }

    // create a new citation having the specified parameters
    public static createCitation(authorId: number, subject: string, message: string): Promise<number> {
        return new Promise<number>((resolve: (value?: number) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createCitation(authorId, subject, message));
        });
    }

    // update citation's data by the specified id
    public static updateCitation(id: number, authorId: number, subject: string, message: string): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.updateCitation(id, authorId, subject, message));
        });
    }
}
