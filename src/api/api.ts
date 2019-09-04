import { IAuthorRecord, ICitationRecord } from '../database/database';
import { DataBase } from '../database/database';

export class API {
    // получить список всех авторов
    public static getAuthors(): Promise<IAuthorRecord[]> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getAuthors());
        });
    }

    // найти автора по заданному id
    public static findAuthor(id: number): Promise<IAuthorRecord | null> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findAuthor(id));
        });
    }

    // удалить автора по заданному id
    public static deleteAuthor(id: number): Promise<boolean> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteAuthor(id));
        });
    }

    // создать нового автора
    public static createAuthor(firstName: string, lastName: string, dateOfBirth: Date): Promise<void> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createAuthor(firstName, lastName, dateOfBirth));
        });
    }

    // сохранить заданного автора
    public static modifyAuthor(id: number, firstName: string, lastName: string, dateOfBirth: Date): Promise<void> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.modifyAuthor(id, firstName, lastName, dateOfBirth));
        });
    }

    // получить список всех цитат
    public static getCitations(): Promise<ICitationRecord[]> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getCitations());
        });
    }

    // найти цитату по заданному id
    public static findCitation(id: number): Promise<ICitationRecord | null> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findCitation(id));
        });
    }

    // удалить цитату по заданному id
    public static deleteCitation(id: number): Promise<boolean> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteCitation(id));
        });
    }

    // создать новую цитату
    public static createCitation(authorId: number, subject: string, message: string): Promise<void> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createCitation(authorId, subject, message));
        });
    }

    // сохранить заданную цитату
    public static modifyCitation(id: number, authorId: number, subject: string, message: string): Promise<void> {
        return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.modifyCitation(id, authorId, subject, message));
        });
    }
}
