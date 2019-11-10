export interface IUserRecord {
    id    : number;
    login : string;
    phash : string;
}

export interface IAuthorRecord {
    id          : number;
    firstName   : string;
    lastName    : string;
    dateOfBirth : Date;
}

export interface ICitationRecord {
    id        : number;
    authorId  : number;
    subject   : string;
    message   : string;
    createdAt : Date;
}

export class DataBase {
    // user table
    private static readonly TABLE_USERS: IUserRecord[] = [
        {
            id    : 1,
            login : 'guest',
            phash : '35675e68f4b5af7b995d9205ad0fc43842f16450'
        }
    ];

    // author table
    private static readonly TABLE_AUTHORS: IAuthorRecord[] = [
        {
            id          : 1,
            firstName   : 'Михаил',
            lastName    : 'Лермонтов',
            dateOfBirth : new Date('1814-10-03')
        },
        {
            id          : 2,
            firstName   : 'Лев',
            lastName    : 'Толстой',
            dateOfBirth : new Date('1828-08-28')
        },
        {
            id          : 3,
            firstName   : 'Антон',
            lastName    : 'Чехов',
            dateOfBirth : new Date('1860-01-17')
        },
        {
            id          : 4,
            firstName   : 'Сергей',
            lastName    : 'Есенин',
            dateOfBirth : new Date('1895-09-21')
        },
        {
            id          : 5,
            firstName   : 'Даниил',
            lastName    : 'Хармс',
            dateOfBirth : new Date('1905-12-17')
        },
    ];

    // citation table
    private static readonly TABLE_CITATIONS: ICitationRecord[] = [
        {
            id        : 1,
            authorId  : 1,
            subject   : 'Из стихотворения "Парус"',
            message   : "Белеет парус одинокой\nВ тумане моря голубом!..\nЧто ищет он в стране далекой?\nЧто кинул он в краю родном?..",
            createdAt : new Date()
        },
        {
            id        : 2,
            authorId  : 1,
            subject   : 'Из рассказа "Кавказский пленник"',
            message   : "Дело было летом. Собрались на зорьке обозы за крепость, вышли провожатые солдаты и тронулись по дороге. Жилин ехал верхом, а телега с его вещами шла в обозе.\nЕхать было 25 верст. Обоз шел тихо; то солдаты остановятся, то в обозе колесо у кого соскочит, или лошадь станет, и все стоят — дожидаются.\nСолнце уже и за полдни перешло, а обоз только половину дороги прошел. Пыль, жара, солнце так и печет, а укрыться негде. Голая степь, ни деревца, ни кустика по дороге.",
            createdAt : new Date()
        },
        {
            id        : 3,
            authorId  : 2,
            subject   : 'Наблюдение про семьи из "Анны Карениной"',
            message   : "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.",
            createdAt : new Date()
        },
        {
            id        : 4,
            authorId  : 2,
            subject   : 'Лица бывают не только вражеские, но и "комнатные"',
            message   : "Драгунский французский офицер одной ногой прыгал на земле, другой зацепился в стремени. Он, испуганно щурясь, как будто ожидая всякую секунду нового удара, сморщившись, с выражением ужаса взглянул снизу вверх на Ростова. Лицо его, бледное и забрызганное грязью, белокурое, молодое, с дырочкой на подбородке и светлыми голубыми глазами, было самое не для поля сражения, не вражеское лицо, а самое простое комнатное лицо.",
            createdAt : new Date()
        },
        {
            id        : 5,
            authorId  : 3,
            subject   : 'О блинах на масленницу',
            message   : "Надворный советник Семен Петрович Подтыкин сел за стол, покрыл свою грудь салфеткой и, сгорая нетерпением, стал ожидать того момента, когда начнут подавать блины… Перед ним, как перед полководцем, осматривающим поле битвы, расстилалась целая картина…",
            createdAt : new Date()
        },
        {
            id        : 6,
            authorId  : 3,
            subject   : 'Два газетчика',
            message   : '— А что ж? — окрысился Шлепкин. — Чем, по-твоему, плохо выеденное яйцо? Масса вопросов! Во-первых, когда ты видишь перед собой выеденное яйцо, тебя охватывает негодование, ты возмущен!! Яйцо, предназначенное природою для воспроизведения жизни индивидуума... понимаешь! жизни!.. жизни, которая в свою очередь дала бы жизнь целому поколению, а это поколение тысячам будущих поколений, вдруг съедено, стало жертвою чревоугодия, прихоти! Это яйцо дало бы курицу, курица в течение всей своей жизни снесла бы тысячу яиц... — вот тебе, как на ладони, подрыв экономического строя, заедание будущего! Во-вторых, глядя на выеденное яйцо, ты радуешься: если яйцо съедено, то, значит, на Руси хорошо питаются... В-третьих, тебе приходит на мысль, что яичной скорлупой удобряют землю, и ты советуешь читателю дорожить отбросами. В-четвертых, выеденное яйцо наводит тебя на мысль о бренности всего земного: жило и нет его! В-пятых... Да что я считаю? На сто нумеров хватит! ',
            createdAt : new Date()
        },
        {
            id        : 7,
            authorId  : 4,
            subject   : 'Собаке Качалова',
            message   : "Дай, Джим, на счастье лапу мне,\nТакую лапу не видал я сроду.\nДавай с тобой полаем при луне\nНа тихую, бесшумную погоду.\nДай, Джим, на счастье лапу мне.",
            createdAt : new Date()
        },
        {
            id        : 8,
            authorId  : 4,
            subject   : 'Нивы сжаты, рощи голы...',
            message   : "Нивы сжаты, рощи голы,\nОт воды туман и сырость.\nКолесом за сини горы\nСолнце тихое скатилось.\n\nДремлет взрытая дорога.\nЕй сегодня примечталось,\nЧто совсем-совсем немного\nЖдать зимы седой осталось.\n\nАх, и сам я в чаще звонкой\nУвидал вчера в тумане:\nРыжий месяц жеребенком\nЗапрягался в наши сани.",
            createdAt : new Date()
        },
        {
            id        : 9,
            authorId  : 5,
            subject   : 'О гениях',
            message   : 'Пушкин сидит у себя и думает: «Я гений, и ладно. Гоголь тоже гений. Но ведь и Толстой гений, и Достоевский, царствие ему небесное, гений. Когда же это кончится?» Тут все и кончилось...',
            createdAt : new Date()
        },
        {
            id        : 10,
            authorId  : 5,
            subject   : 'О вреде наук',
            message   : "Открыв наук зеленый том\nя долго плакал, а потом\nего закрыл и бросил в реку.\nНауки вредны человеку.\nнауки втянут нас в беду\nвозьмемтесь лучше за еду.",
            createdAt : new Date()
        }
    ];

    // authorize a user with the specified login and password
    public static authorize(login: string, passw: string): boolean {
        const sha1  : any     = require('simple-sha1');
        const phash : string  = sha1.sync(passw);
        let   found : boolean = false;

        for (let i: number = 0; i < DataBase.TABLE_USERS.length; i++) {
            if (DataBase.TABLE_USERS[i].login === login && DataBase.TABLE_USERS[i].phash === phash) {
                found = true;
                break;
            }
        }
        return found;
    }

    // get a list of all authors
    public static getAuthors(): IAuthorRecord[] {
        const authors: IAuthorRecord[] = [];
        for (let i: number = 0; i < DataBase.TABLE_AUTHORS.length; i++) {
            authors.push(DataBase.TABLE_AUTHORS[i]);
        }
        return authors;
    }

    // find an author by the specified id
    public static findAuthor(id: number): IAuthorRecord | null {
        let author: IAuthorRecord | null = null;
        for (let i: number = 0; i < DataBase.TABLE_AUTHORS.length; i++) {
            if (DataBase.TABLE_AUTHORS[i].id === id) {
                author = DataBase.TABLE_AUTHORS[i];
                break;
            }
        }
        return author;
    }

    // remove an author by the specified id
    public static deleteAuthor(id: number): boolean {
        let index: number = -1;
        for (let i: number = 0; i < DataBase.TABLE_AUTHORS.length; i++) {
            if (DataBase.TABLE_AUTHORS[i].id === id) {
                index = i;
                break;
            }
        }
        if (index > 0) {
            DataBase.TABLE_AUTHORS.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    // create a new author having the specified parameters
    public static createAuthor(firstName: string, lastName: string, dateOfBirth: Date): number {
        let id: number;
        let found: boolean;
        for (id = 1; id < Number.MAX_SAFE_INTEGER; id++) {
            found = false;
            for (let i: number = 0; i < DataBase.TABLE_AUTHORS.length; i++) {
                if (DataBase.TABLE_AUTHORS[i].id === id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        DataBase.TABLE_AUTHORS.push({
            id,
            firstName,
            lastName,
            dateOfBirth
        });

        return id;
    }

    // update author's data by the specified id
    public static updateAuthor(id: number, firstName: string, lastName: string, dateOfBirth: Date): boolean {
        let found: boolean = false;
        for (let i: number = 0; i < DataBase.TABLE_AUTHORS.length; i++) {
            if (DataBase.TABLE_AUTHORS[i].id === id) {
                DataBase.TABLE_AUTHORS[i] = {
                    id,
                    firstName,
                    lastName,
                    dateOfBirth
                };
                found = true;
                break;
            }
        }
        return found;
    }

    // get a list of all citations
    public static getCitations(authorId?: number): ICitationRecord[] {
        const citations: ICitationRecord[] = [];
        for (let i: number = 0; i < DataBase.TABLE_CITATIONS.length; i++) {
            if (!authorId || DataBase.TABLE_CITATIONS[i].authorId === authorId) {
                citations.push(DataBase.TABLE_CITATIONS[i]);
            }
        }
        return citations;
    }

    // find a citation by the specified id
    public static findCitation(id: number): ICitationRecord | null {
        let citation: ICitationRecord | null = null;
        for (let i: number = 0; i < DataBase.TABLE_CITATIONS.length; i++) {
            if (DataBase.TABLE_CITATIONS[i].id === id) {
                citation = DataBase.TABLE_CITATIONS[i];
                break;
            }
        }
        return citation;
    }

    // remove a citation by the specified id
    public static deleteCitation(id: number): boolean {
        let index: number = -1;
        for (let i: number = 0; i < DataBase.TABLE_CITATIONS.length; i++) {
            if (DataBase.TABLE_CITATIONS[i].id === id) {
                index = i;
                break;
            }
        }
        if (index > 0) {
            DataBase.TABLE_CITATIONS.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    // create a new citation having the specified parameters
    public static createCitation(authorId: number, subject: string, message: string): number {
        let id: number;
        let found: boolean;
        for (id = 1; id < Number.MAX_SAFE_INTEGER; id++) {
            found = false;
            for (let i: number = 0; i < DataBase.TABLE_CITATIONS.length; i++) {
                if (DataBase.TABLE_CITATIONS[i].id === id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        DataBase.TABLE_CITATIONS.push({
            id,
            authorId,
            subject,
            message,
            createdAt: new Date()
        });

        return id;
    }

    // update citation's data by the specified id
    public static updateCitation(id: number, authorId: number, subject: string, message: string): boolean {
        let found: boolean = false;
        for (let i: number = 0; i < DataBase.TABLE_CITATIONS.length; i++) {
            if (DataBase.TABLE_CITATIONS[i].id === id) {
                DataBase.TABLE_CITATIONS[i] = {
                    id,
                    authorId,
                    subject,
                    message,
                    createdAt: DataBase.TABLE_CITATIONS[i].createdAt
                };
                found = true;
                break;
            }
        }
        return found;
    }
}