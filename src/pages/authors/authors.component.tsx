import React, { RefObject } from 'react';
import Moment from 'react-moment';

import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { API } from '../../api/api';
import { IAuthorRecord } from '../../database/database';

import ColumnSort, { SORT } from '../../elements/column-sort/column-sort';

enum ModifyMode {
    NONE,
    CREATE,
    UPDATE
}

interface ISortRefs {
    refSortId          : RefObject<ColumnSort>,
    refSortFirstName   : RefObject<ColumnSort>,
    refSortLastName    : RefObject<ColumnSort>,
    refSortDateOfBirth : RefObject<ColumnSort>
}

interface IAuthorList {
    authors: IAuthorRecord[]
}

interface IModifyModal {
    modifyId   : number;
    modifyMode : ModifyMode;
}

interface IDeleteModal {
    deleteId   : number;
    showDelete : boolean;
}

interface IModifyAuthor {
    firstName    : string;
    lastName     : string;
    yearOfBirth  : number;
    monthOfBirth : number;
    dayOfBirth   : number;
}

interface IAuthorSort {
    sortBy   : string;
    sortMode : SORT;
}

// the component to represent a list of authors
export default class AuthorsComponent extends React.Component<IAuthorList & IAuthorSort & IModifyModal & IDeleteModal, any> {
    private author: IModifyAuthor = {
        firstName    : '',
        lastName     : '',
        yearOfBirth  : 0,
        monthOfBirth : 0,
        dayOfBirth   : 0
    };

    // refs
    private sortRefs: ISortRefs;

    // component constructor
    public constructor(props: any) {
        super(props);

        const authorSort: string | null = localStorage.getItem('AUTHOR_SORT');

        this.state = {
            authors    : [],
            authorSort : authorSort ? JSON.parse(authorSort) : {sortBy: 'ID', sortMode: SORT.ASCENDING},
            modifyId   : -1,
            modifyMode : ModifyMode.NONE,
            deleteId   : -1,
            showDelete : false
        };

        this.sortRefs = {
            refSortId          : React.createRef(),
            refSortFirstName   : React.createRef(),
            refSortLastName    : React.createRef(),
            refSortDateOfBirth : React.createRef()
        };

        this.tableBody      = this.tableBody.bind(this);
        this.modalModify    = this.modalModify.bind(this);
        this.modifyAuthor   = this.modifyAuthor.bind(this);
        this.modalDelete    = this.modalDelete.bind(this);
        this.deleteAuthor   = this.deleteAuthor.bind(this);
        this.onClickCreate  = this.onClickCreate.bind(this);
        this.onClickUpdate  = this.onClickUpdate.bind(this);
        this.onClickSorting = this.onClickSorting.bind(this);
    }

    // component initialization hook
    public componentDidMount(): void {
        this.getAutors();
    }

    // author sorting
    private sortAuthors(authors: IAuthorRecord[], sortBy: string, sortMode: SORT): void {
        const fnSortByIdAsc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const id1: number = a1.id;
            const id2: number = a2.id;
            return id1 < id2 ? -1 : (id1 > id2 ? 1 : 0);
        };
        const fnSortByIdDesc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const id1: number = a1.id;
            const id2: number = a2.id;
            return id1 > id2 ? -1 : (id1 < id2 ? 1 : 0);
        };
        const fnSortByFirstNameAsc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const fn1: string = a1.firstName;
            const fn2: string = a2.firstName;
            return fn1 < fn2 ? -1 : (fn1 > fn2 ? 1 : 0);
        };
        const fnSortByFirstNameDesc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const fn1: string = a1.firstName;
            const fn2: string = a2.firstName;
            return fn1 > fn2 ? -1 : (fn1 < fn2 ? 1 : 0);
        };
        const fnSortByLastNameAsc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const ln1: string = a1.lastName;
            const ln2: string = a2.lastName;
            return ln1 < ln2 ? -1 : (ln1 > ln2 ? 1 : 0);
        };
        const fnSortByLastNameDesc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const ln1: string = a1.lastName;
            const ln2: string = a2.lastName;
            return ln1 > ln2 ? -1 : (ln1 < ln2 ? 1 : 0);
        };
        const fnSortByDateOfBirthAsc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const t1: number = a1.dateOfBirth.getTime();
            const t2: number = a2.dateOfBirth.getTime();
            return t1 < t2 ? -1 : (t1 > t2 ? 1 : 0);
        };
        const fnSortByDateOfBirthDesc = (a1: IAuthorRecord, a2: IAuthorRecord) => {
            const t1: number = a1.dateOfBirth.getTime();
            const t2: number = a2.dateOfBirth.getTime();
            return t1 > t2 ? -1 : (t1 < t2 ? 1 : 0);
        };

        switch (sortBy) {
            case 'ID':
                authors.sort(sortMode === SORT.ASCENDING ? fnSortByIdAsc : fnSortByIdDesc);
                break;
            case 'FIRST_NAME':
                authors.sort(sortMode === SORT.ASCENDING ? fnSortByFirstNameAsc : fnSortByFirstNameDesc);
                break;
            case 'LAST_NAME':
                authors.sort(sortMode === SORT.ASCENDING ? fnSortByLastNameAsc : fnSortByLastNameDesc);
                break;
            case 'DATE_OF_BIRTH':
                authors.sort(sortMode === SORT.ASCENDING ? fnSortByDateOfBirthAsc : fnSortByDateOfBirthDesc);
                break;
            default:
                // Nothing!
        }
    }

    // body of the table
    private tableBody(): JSX.Element | null {
        if (this.state.authors.length > 0) {
            return (
                <tbody>
                    {this.state.authors.map((author: any) => (
                    <tr key={author.id}>
                        <td>{author.id}</td>
                        <td>{author.firstName}</td>
                        <td>{author.lastName}</td>
                        <td>
                            <Moment format="YYYY-MM-DD">{author.dateOfBirth}</Moment>
                        </td>
                        <td>
                            <Button variant="success" size="sm" title="Редактировать" onClick={() => this.onClickUpdate(author.id)}>
                                <FontAwesomeIcon icon={faEdit} fixedWidth />
                            </Button>
                            &nbsp;
                            <Button variant="danger" size="sm" title="Удалить" onClick={() => this.onClickDelete(author.id)}>
                                <FontAwesomeIcon icon={faTimes} fixedWidth />
                            </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            );
        } else {
             return null;
        }
    }

    // modal dialog to create or edit an author
    private modalModify(): JSX.Element | null {
        // field input event handler
        const handleInput = (evt: any) => {
            switch (evt.target.name) {
                case 'firstName':
                    this.author.firstName = evt.target.value;
                    break;
                case 'lastName':
                    this.author.lastName = evt.target.value;
                    break;
                case 'yearOfBirth':
                    this.author.yearOfBirth = parseInt(evt.target.value, 10);
                    break;
                case 'monthOfBirth':
                    this.author.monthOfBirth = parseInt(evt.target.value, 10);
                    break;
                case 'dayOfBirth':
                    this.author.dayOfBirth = parseInt(evt.target.value, 10);
                    break;
                default:
                    // Nothing!
            }
        };

        // author save event handler
        const handleSave = () => {
            this.modifyAuthor();
        };

        // dialog close event handler
        const handleClose = () => {
            this.setState({
                modifyMode: ModifyMode.NONE
            });
        };

        return (
            <Modal centered size="lg" show={this.state.modifyMode !== ModifyMode.NONE} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modifyMode === ModifyMode.CREATE ? 'Новый автор' : 'Редактирование автора'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Имя</Form.Label>
                            <Col md="8">
                                <Form.Control type="text" name="firstName" placeholder="" defaultValue={this.author.firstName} onChange={handleInput} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Фамилия</Form.Label>
                            <Col md="8">
                                <Form.Control type="text" name="lastName" placeholder="" defaultValue={this.author.lastName} onChange={handleInput} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Дата рождения</Form.Label>
                            <Col md="4">
                                <Form.Control type="text" name="yearOfBirth" placeholder="год" defaultValue={this.author.yearOfBirth.toString()} onChange={handleInput} />
                            </Col>
                            <Col md="2">
                                <Form.Control type="text" name="monthOfBirth" placeholder="месяц" defaultValue={this.author.monthOfBirth.toString()} onChange={handleInput} />
                            </Col>
                            <Col md="2">
                                <Form.Control type="text" name="dayOfBirth" placeholder="день" defaultValue={this.author.dayOfBirth.toString()} onChange={handleInput} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSave}>Сохранить</Button>
                    <Button variant="secondary" onClick={handleClose}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // modal dialog to remove an author
    private modalDelete(): JSX.Element | null {
        const handleClose = () => {
            this.setState({
                showDelete: false
            });
        };

        return (
            <Modal centered show={this.state.showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Требуется подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы действительно хотите удалить выбранного автора?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.deleteAuthor}>Удалить</Button>
                    <Button variant="secondary" onClick={handleClose}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // component output
    public render(): JSX.Element | null {
        return (
            <div className="container-fluid text-left">
                <div className="d-flex justify-content-between">
                    <h3>Авторы</h3>
                    <Button variant="info" size="sm" onClick={this.onClickCreate}>
                        <FontAwesomeIcon icon={faPlus} fixedWidth /> Новый автор
                    </Button>
                </div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col" className="w-15">
                                ID
                                <ColumnSort
                                    column="ID"
                                    callback={this.onClickSorting}
                                    mode={this.state.authorSort.sortBy === 'ID' ? this.state.authorSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortId}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Имя
                                <ColumnSort
                                    column="FIRST_NAME"
                                    callback={this.onClickSorting}
                                    mode={this.state.authorSort.sortBy === 'FIRST_NAME' ? this.state.authorSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortFirstName}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Фамилия
                                <ColumnSort
                                    column="LAST_NAME"
                                    callback={this.onClickSorting}
                                    mode={this.state.authorSort.sortBy === 'LAST_NAME' ? this.state.authorSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortLastName}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Дата рождения
                                <ColumnSort
                                    column="DATE_OF_BIRTH"
                                    callback={this.onClickSorting}
                                    mode={this.state.authorSort.sortBy === 'DATE_OF_BIRTH' ? this.state.authorSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortDateOfBirth}
                                />
                            </th>
                            <th scope="col" className="w-10">Действия</th>
                        </tr>
                    </thead>
                    <this.tableBody />
                </table>
                <this.modalModify />
                <this.modalDelete />
            </div>
        );
    }

    // request the list of authors
    private getAutors(): void {
        // getting the list in a manner of AJAX request
        API.getAuthors()
            .then((authors: IAuthorRecord[]) => {
                this.sortAuthors(authors, this.state.authorSort.sortBy, this.state.authorSort.sortMode);
                this.setState({
                    authors
                });
            });
    }

    // column sort click event handler
    private onClickSorting(sortBy: string, sortMode: SORT): void {
        switch (sortBy) {
            case 'ID':
                (this.sortRefs.refSortFirstName.current as any).reset();
                (this.sortRefs.refSortLastName.current as any).reset();
                (this.sortRefs.refSortDateOfBirth.current as any).reset();
                break;
            case 'FIRST_NAME':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortLastName.current as any).reset();
                (this.sortRefs.refSortDateOfBirth.current as any).reset();
                break;
            case 'LAST_NAME':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortFirstName.current as any).reset();
                (this.sortRefs.refSortDateOfBirth.current as any).reset();
                break;
            case 'DATE_OF_BIRTH':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortFirstName.current as any).reset();
                (this.sortRefs.refSortLastName.current as any).reset();
                break;
            default:
                // Nothing!
        }
        const authorSort: IAuthorSort = {
            sortBy,
            sortMode
        };
        this.setState({
            authorSort
        });
        localStorage.setItem('AUTHOR_SORT', JSON.stringify(authorSort));
        this.sortAuthors(this.state.authors, sortBy, sortMode);
    }

    // author create event handler
    private onClickCreate(): void {
        const today: Date = new Date();

        this.author.firstName    = '';
        this.author.lastName     = '';
        this.author.yearOfBirth  = today.getFullYear();
        this.author.monthOfBirth = today.getMonth() + 1;
        this.author.dayOfBirth   = today.getDate();

        this.setState({
            modifyId   : -1,
            modifyMode : ModifyMode.CREATE
        });
    }

    // author modification event handler
    private onClickUpdate(id: number): void {
        for (let i: number = 0; i < this.state.authors.length; i++) {
            if (this.state.authors[i].id === id) {
                let author: IAuthorRecord = this.state.authors[i];
                this.author.firstName    = author.firstName;
                this.author.lastName     = author.lastName;
                this.author.yearOfBirth  = author.dateOfBirth.getFullYear();
                this.author.monthOfBirth = author.dateOfBirth.getMonth() + 1;
                this.author.dayOfBirth   = author.dateOfBirth.getDate();
                break;
            }
        }

        this.setState({
            modifyId   : id,
            modifyMode : ModifyMode.UPDATE
        });
    }

    // save an author
    private modifyAuthor(): void {
        let dateOfBirth: Date;

        if (isNaN(this.author.yearOfBirth) || this.author.yearOfBirth < 0 || this.author.yearOfBirth > 2019) {
            window.alert('Неправильно задан год рождения автора!');
            return;
        } else if (isNaN(this.author.monthOfBirth) || this.author.monthOfBirth < 1 || this.author.monthOfBirth > 12) {
            window.alert('Неправильно задан месяц рождения автора!');
            return;
        } else if (isNaN(this.author.dayOfBirth) || this.author.dayOfBirth < 1 || this.author.dayOfBirth > 31) {
            window.alert('Неправильно задан день рождения автора!');
            return;
        } else {
            dateOfBirth = new Date(this.author.yearOfBirth, this.author.monthOfBirth - 1, this.author.dayOfBirth);
        }

        // saving the author's data in a manner of AJAX request
        if (this.state.modifyMode === ModifyMode.CREATE) {
            API.createAuthor(this.author.firstName, this.author.lastName, dateOfBirth)
                .then((id: number) => {
                    const authors: IAuthorRecord[] = this.state.authors;
                    authors.push({
                        id          : id,
                        firstName   : this.author.firstName,
                        lastName    : this.author.lastName,
                        dateOfBirth : dateOfBirth
                    });
                    this.sortAuthors(authors, this.state.authorSort.sortBy, this.state.authorSort.sortMode);

                    this.setState({
                        authors,
                        modifyId   : -1,
                        modifyMode : ModifyMode.NONE
                    });
                });
        } else if (this.state.modifyMode === ModifyMode.UPDATE) {
            API.updateAuthor(this.state.modifyId, this.author.firstName, this.author.lastName, dateOfBirth)
                .then(() => {
                    const authors: IAuthorRecord[] = this.state.authors;
                    for (let i = 0; i < authors.length; i++) {
                        if (authors[i].id === this.state.modifyId) {
                            authors[i] = {
                                id          : this.state.modifyId,
                                firstName   : this.author.firstName,
                                lastName    : this.author.lastName,
                                dateOfBirth : dateOfBirth
                            }
                            break;
                        }
                    }
                    this.setState({
                        authors,
                        modifyId   : -1,
                        modifyMode : ModifyMode.NONE
                    });
                });
        }
    }

    // author remove event handler
    private onClickDelete(id: number): void {
        this.setState({
            deleteId   : id,
            showDelete : true
        });
    }

    // remove an author
    private deleteAuthor(): void {
        // removing the selected citation in a manner of AJAX request
        API.deleteAuthor(this.state.deleteId)
            .then(() => {
                const authors: IAuthorRecord[] = this.state.authors;
                for (let i = 0; i < authors.length; i++) {
                    if (authors[i].id === this.state.deleteId) {
                        authors.splice(i, 1);
                        break;
                    }
                }
                this.setState({
                    authors,
                    deleteId   : -1,
                    showDelete : false
                });
            });
    }
}
