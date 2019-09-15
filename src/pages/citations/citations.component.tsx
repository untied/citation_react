import React, { RefObject } from 'react';
import Moment from 'react-moment';

import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { API } from '../../api/api';
import { IAuthorRecord, ICitationRecord } from '../../database/database';

import ColumnSort, { SORT } from '../../elements/column-sort/column-sort';

const nl2br: any = require('react-nl2br');

enum ModifyMode {
    NONE,
    CREATE,
    UPDATE
}

interface IAuthorHash {
    [id: number]: IAuthorRecord
}

interface ISortRefs {
    refSortId      : RefObject<ColumnSort>,
    refSortDate    : RefObject<ColumnSort>,
    refSortAuthor  : RefObject<ColumnSort>,
    refSortSubject : RefObject<ColumnSort>
}

interface ICitationRecordExt extends ICitationRecord {
    authorFullName: string;
}

interface ICitationList {
    citations: ICitationRecordExt[]
}

interface IModifyCitation {
    subject  : string;
    message  : string;
    authorId : number;
}

interface ICitationSort {
    sortBy   : string;
    sortMode : SORT;
}

// the component to represent a list of citations
export default class CitationsComponent extends React.Component<ICitationList & ICitationSort, any> {
    // currently selected citation
    private citation: IModifyCitation = {
        subject  : '',
        message  : '',
        authorId : -1
    };

    // list of authors
    private authors: IAuthorRecord[] = [];

    // hashed authors
    private authorHash: IAuthorHash = {};

    // refs
    private sortRefs: ISortRefs;

    // component constructor
    public constructor(props: any) {
        super(props);

        const citationSort: string | null = localStorage.getItem('CITATION_SORT');

        this.state = {
            citations      : [],
            citationSort   : citationSort ? JSON.parse(citationSort) : {sortBy: 'ID', sortMode: SORT.ASCENDING},
            citationLength : 0,
            modifyId       : -1,
            showReveal     : false,
            modifyMode     : ModifyMode.NONE,
            deleteId       : -1,
            showDelete     : false
        };

        this.sortRefs = {
            refSortId      : React.createRef(),
            refSortDate    : React.createRef(),
            refSortAuthor  : React.createRef(),
            refSortSubject : React.createRef()
        };

        this.tableBody      = this.tableBody.bind(this);
        this.modalReveal    = this.modalReveal.bind(this);
        this.modalModify    = this.modalModify.bind(this);
        this.modifyCitation = this.modifyCitation.bind(this);
        this.modalDelete    = this.modalDelete.bind(this);
        this.deleteCitation = this.deleteCitation.bind(this);
        this.onClickCreate  = this.onClickCreate.bind(this);
        this.onClickUpdate  = this.onClickUpdate.bind(this);
        this.onClickSorting = this.onClickSorting.bind(this);
    }

    // component initialization hook
    public componentDidMount(): void {
        this.getCitations();
        this.getAutors();
    }

    // citation sorting
    private sortCitations(citations: ICitationRecordExt[], sortBy: string, sortMode: SORT): void {
        const fnSortByIdAsc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const id1: number = c1.id;
            const id2: number = c2.id;
            return id1 < id2 ? -1 : (id1 > id2 ? 1 : 0);
        };
        const fnSortByIdDesc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const id1: number = c1.id;
            const id2: number = c2.id;
            return id1 > id2 ? -1 : (id1 < id2 ? 1 : 0);
        };
        const fnSortByDateAsc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const t1: number = c1.createdAt.getTime();
            const t2: number = c2.createdAt.getTime();
            return t1 < t2 ? -1 : (t1 > t2 ? 1 : 0);
        };
        const fnSortByDateDesc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const t1: number = c1.createdAt.getTime();
            const t2: number = c2.createdAt.getTime();
            return t1 > t2 ? -1 : (t1 < t2 ? 1 : 0);
        };
        const fnSortByAuthorAsc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const sb1: string = c1.authorFullName;
            const sb2: string = c2.authorFullName;
            return sb1 < sb2 ? -1 : (sb1 > sb2 ? 1 : 0);
        };
        const fnSortByAuthorDesc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const sb1: string = c1.authorFullName;
            const sb2: string = c2.authorFullName;
            return sb1 > sb2 ? -1 : (sb1 < sb2 ? 1 : 0);
        };
        const fnSortBySubjectAsc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const sb1: string = c1.subject;
            const sb2: string = c2.subject;
            return sb1 < sb2 ? -1 : (sb1 > sb2 ? 1 : 0);
        };
        const fnSortBySubjectDesc = (c1: ICitationRecordExt, c2: ICitationRecordExt) => {
            const sb1: string = c1.subject;
            const sb2: string = c2.subject;
            return sb1 > sb2 ? -1 : (sb1 < sb2 ? 1 : 0);
        };

        switch (sortBy) {
            case 'ID':
                citations.sort(sortMode === SORT.ASCENDING ? fnSortByIdAsc : fnSortByIdDesc);
                break;
            case 'DATE':
                citations.sort(sortMode === SORT.ASCENDING ? fnSortByDateAsc : fnSortByDateDesc);
                break;
            case 'AUTHOR':
                citations.sort(sortMode === SORT.ASCENDING ? fnSortByAuthorAsc : fnSortByAuthorDesc);
                break;
            case 'SUBJECT':
                citations.sort(sortMode === SORT.ASCENDING ? fnSortBySubjectAsc : fnSortBySubjectDesc);
                break;
            default:
                // Nothing!
        }
    }

    // body of the table
    private tableBody(): JSX.Element | null {
        if (this.state.citations.length > 0) {
            return (
                <tbody>
                    {this.state.citations.map((citation: any) => (
                    <tr key={citation.id}>
                        <td>{citation.id}</td>
                        <td>
                            <Moment format="YYYY-MM-DD">{citation.createdAt}</Moment>
                        </td>
                        <td>{citation.authorFullName}</td>
                        <td>
                            <a href="#!" onClick={(evt: any) => this.onClickReveal(citation.id, evt)}>{citation.subject}</a>
                        </td>
                        <td>
                            <Button variant="success" size="sm" title="Редактировать" onClick={() => this.onClickUpdate(citation.id)}>
                                <FontAwesomeIcon icon={faEdit} fixedWidth />
                            </Button>
                            &nbsp;
                            <Button variant="danger" size="sm" title="Удалить" onClick={() => this.onClickDelete(citation.id)}>
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

    // request the list of citations
    private getCitations() {
        // getting the list in a manner of AJAX request
        API.getCitations()
            .then(async (citRecs: ICitationRecord[]) => {
                let citations: ICitationRecordExt[] = [];
                for (let i = 0; i < citRecs.length; i++) {
                    citations.push({
                        ...citRecs[i],
                        authorFullName: typeof this.authorHash[citRecs[i].authorId] === 'undefined' ?
                            await this.findAuthor(citRecs[i].authorId) :
                            `${this.authorHash[citRecs[i].authorId].firstName} ${this.authorHash[citRecs[i].authorId].lastName}`
                    });
                }
                this.sortCitations(citations, this.state.citationSort.sortBy, this.state.citationSort.sortMode);
                this.setState({
                    citations
                });
            });
    }

    // request the list of authors
    private getAutors(): void {
        // getting the list in a manner of AJAX request
        API.getAuthors()
            .then((authors: IAuthorRecord[]) => {
                this.authors = authors;
            });
    }

    // request the specified author
    private async findAuthor(id: number): Promise<string> {
        // getting the author's data in a manner of AJAX request
        return API.findAuthor(id)
            .then((author: IAuthorRecord | null) => {
                if (author) {
                    this.authorHash[author.id] = {
                        id          : author.id,
                        firstName   : author.firstName,
                        lastName    : author.lastName,
                        dateOfBirth : author.dateOfBirth
                    };
                }
                return new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void): void => {
                    resolve(author !== null ? `${author.firstName} ${author.lastName}` : '');
                })
            });
    }

    // modal dialog to display a citation
    private modalReveal(): JSX.Element | null {
        // dilog close event handler
        const handleClose = () => {
            this.setState({
                showReveal: false
            });
        };

        const authorFullName: string = typeof this.authorHash[this.citation.authorId] !== 'undefined' ?
            `${this.authorHash[this.citation.authorId].firstName} ${this.authorHash[this.citation.authorId].lastName}` : '';

        return (
            <Modal centered show={this.state.showReveal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Просмотр цитаты</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>{this.citation.subject}</h5>
                    <p>{nl2br(this.citation.message)}</p>
                    <p className="font-italic text-right">{authorFullName}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // modal dialog to create or edit a citation
    private modalModify(): JSX.Element | null {
        // field input event handler
        const handleInput = (evt: any) => {
            switch (evt.target.name) {
                case 'subject':
                    this.citation.subject = evt.target.value;
                    break;
                case 'message':
                    this.citation.message = evt.target.value;
                    this.setState({
                        citationLength: this.citation.message.length
                    });
                    break;
                case 'authorId':
                    this.citation.authorId = parseInt(evt.target.value, 10);
                    break;
                default:
                    // Nothing!
            }
        };

        // citation save event handler
        const handleSave = () => {
            this.modifyCitation();
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
                    <Modal.Title>{this.state.modifyMode === ModifyMode.CREATE ? 'Новая цитата' : 'Редактирование цитаты'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Заголовок</Form.Label>
                            <Col md="8">
                                <Form.Control type="text" name="subject" placeholder="" defaultValue={this.citation.subject} onChange={handleInput} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Текст</Form.Label>
                            <Col md="8">
                                <Form.Control as="textarea" name="message" className="no-resize" rows="10" placeholder="" defaultValue={this.citation.message} onChange={handleInput} />
                                <Form.Text className="text-muted">Длина сообщения: {this.state.citationLength}</Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column md="4">Автор</Form.Label>
                            <Col md="8">
                                <Form.Control as="select" name="authorId" defaultValue={this.citation.authorId} onChange={handleInput}>
                                    <option value="-1">&mdash;&mdash;&mdash; пожалуйста, выберите &mdash;&mdash;&mdash;</option>
                                    {this.authors.map((author: any) => (
                                        <option key={author.id} value={author.id}>{author.firstName} {author.lastName}</option>
                                    ))}
                                </Form.Control>
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

    // modal dialog to remove a citation
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
                    <p>Вы действительно хотите удалить выбранную цитату?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.deleteCitation}>Удалить</Button>
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
                    <h3>Цитаты</h3>
                    <Button variant="info" size="sm" onClick={this.onClickCreate}>
                        <FontAwesomeIcon icon={faPlus} fixedWidth /> Новая цитата
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
                                    mode={this.state.citationSort.sortBy === 'ID' ? this.state.citationSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortId}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Дата
                                <ColumnSort
                                    column="DATE"
                                    callback={this.onClickSorting}
                                    mode={this.state.citationSort.sortBy === 'DATE' ? this.state.citationSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortDate}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Автор
                                <ColumnSort
                                    column="AUTHOR"
                                    callback={this.onClickSorting}
                                    mode={this.state.citationSort.sortBy === 'AUTHOR' ? this.state.citationSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortAuthor}
                                />
                            </th>
                            <th scope="col" className="w-25">
                                Заголовок
                                <ColumnSort
                                    column="SUBJECT"
                                    callback={this.onClickSorting}
                                    mode={this.state.citationSort.sortBy === 'SUBJECT' ? this.state.citationSort.sortMode : SORT.UNDEFINED}
                                    ref={this.sortRefs.refSortSubject}
                                />
                            </th>
                            <th scope="col" className="w-10">Действия</th>
                        </tr>
                    </thead>
                    <this.tableBody />
                </table>
                <this.modalReveal />
                <this.modalModify />
                <this.modalDelete />
            </div>
        );
    }

    // column sort click event handler
    private onClickSorting(sortBy: string, sortMode: SORT): void {
        switch (sortBy) {
            case 'ID':
                (this.sortRefs.refSortDate.current as any).reset();
                (this.sortRefs.refSortAuthor.current as any).reset();
                (this.sortRefs.refSortSubject.current as any).reset();
                break;
            case 'DATE':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortAuthor.current as any).reset();
                (this.sortRefs.refSortSubject.current as any).reset();
                break;
            case 'AUTHOR':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortDate.current as any).reset();
                (this.sortRefs.refSortSubject.current as any).reset();
                break;
            case 'SUBJECT':
                (this.sortRefs.refSortId.current as any).reset();
                (this.sortRefs.refSortDate.current as any).reset();
                (this.sortRefs.refSortAuthor.current as any).reset();
                break;
            default:
                // Nothing!
        }
        const citationSort: ICitationSort = {
            sortBy,
            sortMode
        };
        this.setState({
            citationSort
        });
        localStorage.setItem('CITATION_SORT', JSON.stringify(citationSort));
        this.sortCitations(this.state.citations, sortBy, sortMode);
    }

    // citation display event handler
    private onClickReveal(id: number, evt: any): void {
        evt.preventDefault();
        evt.stopPropagation();

        for (let i: number = 0; i < this.state.citations.length; i++) {
            if (this.state.citations[i].id === id) {
                let citation: ICitationRecord = this.state.citations[i];
                this.citation.subject  = citation.subject;
                this.citation.message  = citation.message;
                this.citation.authorId = citation.authorId;
                break;
            }
        }
        this.setState({
            showReveal : true
        });
    }

    // citation create event handler
    private onClickCreate(): void {
        this.citation.subject  = '';
        this.citation.message  = '';
        this.citation.authorId = -1;

        this.setState({
            citationLength : this.citation.message.length,
            modifyId       : -1,
            modifyMode     : ModifyMode.CREATE
        });
    }

    // citation modification event handler
    private onClickUpdate(id: number): void {
        for (let i: number = 0; i < this.state.citations.length; i++) {
            if (this.state.citations[i].id === id) {
                let citation: ICitationRecord = this.state.citations[i];
                this.citation.subject  = citation.subject;
                this.citation.message  = citation.message;
                this.citation.authorId = citation.authorId;
                break;
            }
        }
        this.setState({
            citationLength : this.citation.message.length,
            modifyId       : id,
            modifyMode     : ModifyMode.UPDATE
        });
    }

    // save a citation
    private modifyCitation(): void {
        if (!this.citation.subject) {
            window.alert('Неправильно задан заголовок цитаты!');
            return;
        } else if (!this.citation.message) {
            window.alert('Неправильно задан текст цитаты!');
            return;
        } else if (isNaN(this.citation.authorId) || this.citation.authorId === -1) {
            window.alert('Неправильно задан автор цитаты!');
            return;
        }

        // saving the citation's data in a manner of AJAX request
        if (this.state.modifyMode === ModifyMode.CREATE) {
            API.createCitation(this.citation.authorId, this.citation.subject, this.citation.message)
                .then((id: number) => {
                    let author: IAuthorRecord | null = null;
                    for (let i = 0; i < this.authors.length; i++) {
                        if (this.authors[i].id === this.citation.authorId) {
                            author = this.authors[i];
                            break;
                        }
                    }
                    if (author) {
                        const citations: ICitationRecordExt[] = this.state.citations;
                        citations.push({
                            id             : id,
                            authorId       : this.citation.authorId,
                            authorFullName : `${author.firstName} ${author.lastName}`,
                            subject        : this.citation.subject,
                            message        : this.citation.message,
                            createdAt      : new Date()
                        });
                        this.sortCitations(citations, this.state.citationSort.sortBy, this.state.citationSort.sortMode);
                        this.setState({
                            citations,
                            modifyId   : -1,
                            modifyMode : ModifyMode.NONE
                        });
                    }
                });
        } else if (this.state.modifyMode === ModifyMode.UPDATE) {
            API.updateCitation(this.state.modifyId, this.citation.authorId, this.citation.subject, this.citation.message)
                .then(() => {
                    let author: IAuthorRecord | null = null;
                    for (let i = 0; i < this.authors.length; i++) {
                        if (this.authors[i].id === this.citation.authorId) {
                            author = this.authors[i];
                            break;
                        }
                    }
                    if (author) {
                        const citations: ICitationRecordExt[] = this.state.citations;
                        for (let i = 0; i < citations.length; i++) {
                            if (citations[i].id === this.state.modifyId) {
                                citations[i] = {
                                    id             : this.state.modifyId,
                                    authorId       : this.citation.authorId,
                                    authorFullName : `${author.firstName} ${author.lastName}`,
                                    subject        : this.citation.subject,
                                    message        : this.citation.message,
                                    createdAt      : citations[i].createdAt
                                }
                                break;
                            }
                        }
                        this.sortCitations(citations, this.state.citationSort.sortBy, this.state.citationSort.sortMode);
                        this.setState({
                            citations,
                            modifyId   : -1,
                            modifyMode : ModifyMode.NONE
                        });
                    }
                });
        }
    }

    // citation remove event handler
    private onClickDelete(id: number): void {
        this.setState({
            deleteId   : id,
            showDelete : true
        });
    }

    // remove a citation
    private deleteCitation(): void {
        // removing the selected citation in a manner of AJAX request
        API.deleteCitation(this.state.deleteId)
            .then(() => {
                const citations: ICitationRecord[] = this.state.citations;
                for (let i = 0; i < citations.length; i++) {
                    if (citations[i].id === this.state.deleteId) {
                        citations.splice(i, 1);
                        break;
                    }
                }
                this.setState({
                    citations,
                    deleteId   : -1,
                    showDelete : false
                });
            });
    }
}
