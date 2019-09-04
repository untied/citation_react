import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

import './column-sort.sass';

export enum SORT {
    ASCENDING,
    DESCENDING,
    UNDEFINED
}

interface ISortMode {
    mode?: SORT
}

interface ISortColumn {
    column?: string
}

interface ISortCallback {
    callback?: (column: string, mode: SORT) => void
}

// компонент "Сортировка колонки таблицы"
export default class ColumnSort extends React.Component<ISortMode & ISortColumn & ISortCallback, ISortMode> {
    // конструктор
    public constructor(props: any) {
        super(props);

        this.state = {
            mode: this.props.mode === SORT.ASCENDING || this.props.mode === SORT.DESCENDING ? this.props.mode : SORT.UNDEFINED
        };

        this.onClickSorting = this.onClickSorting.bind(this);
    }

    // сброс сортировки
    public reset(): void {
        this.setState({
            mode: SORT.UNDEFINED
        });
    }

    // вывод
    public render(): JSX.Element | null {
        if (this.state.mode === SORT.UNDEFINED) {
            return (
                <span onClick={this.onClickSorting} className="clickable">
                    <FontAwesomeIcon icon={faSort} fixedWidth className="sorting-undefined" title="Выбрать сортировку" />
                </span>
            );
        } else if (this.state.mode === SORT.ASCENDING) {
            return (
                <span onClick={this.onClickSorting} className="clickable">
                    <FontAwesomeIcon icon={faSortUp} fixedWidth className="sorting-defined" title="Сортировка по возрастанию" />
                </span>
            );
        } else if (this.state.mode === SORT.DESCENDING) {
            return (
                <span onClick={this.onClickSorting} className="clickable">
                    <FontAwesomeIcon icon={faSortDown} fixedWidth className="sorting-defined" title="Сортировка по убыванию" />
                </span>
            );
        } else {
            return null;
        }
    }

    // клик по кнопке сортировки
    private onClickSorting() {
        if (this.props.callback && this.props.column) {
            let newMode: SORT;

            if (this.state.mode === SORT.UNDEFINED) {
                newMode = SORT.ASCENDING;
            } else if (this.state.mode === SORT.ASCENDING) {
                newMode = SORT.DESCENDING;
            } else {
                newMode = SORT.ASCENDING;
            }
            this.setState({
                mode: newMode
            });
            this.props.callback(this.props.column, newMode);
        }
    }
}
