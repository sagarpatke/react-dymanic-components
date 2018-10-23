import React, { Component, Fragment } from 'react';
import axios from 'axios';

export default class CartoonsDirectory extends Component {
    state = {
        cartoons: [],
        newCartoonName: "abc",
        newCartoonCreator: "def",
        editIndex: -1,
        editText: ""
    }

    componentDidMount() {
        axios.get('http://localhost:3001/cartoons')
            .then(res => {
                this.setState({
                    cartoons: res.data
                });
            });
    }

    handleDeleteCartoon(cartoon) {
        console.log('Cartoon to Delete:', cartoon);
        // TODO: 1. Delete cartoon from state
        const oldCartoonsList = this.state.cartoons;
        const newCartoonsList = oldCartoonsList.filter(c => c !== cartoon);
        this.setState({
            cartoons: newCartoonsList
        });

        // TODO: 2. Delete cartoon from server
        axios.delete(`http://localhost:3001/cartoons/${cartoon.id}`)
            .then(res => {
                console.log('Deleted cartoon from server');
            }).catch(err => {
                console.error('There was a problem deleting the cartoon. ERR:', err);
            });
    }

    handleNewCartoonNameChanged(event) {
        this.setState({
            newCartoonName: event.target.value
        })
    }
    
    handleNewCartoonCreatorChanged(event) {
        this.setState({
            newCartoonCreator: event.target.value
        });
    }

    handleCreateNewCartoon(event) {
        event.preventDefault();
        const newCartoon = {
            name: this.state.newCartoonName,
            creator: this.state.newCartoonCreator
        };

        axios.post('http://localhost:3001/cartoons', newCartoon)
            .then(res => {
                const cartoonsList = this.state.cartoons;
                const newCartoonsList = [...cartoonsList, res.data];
                this.setState({
                    cartoons: newCartoonsList,
                    newCartoonName: "",
                    newCartoonCreator: ""
                });
            }).catch(err => {

            });

    }

    handleEdit(index) {
        this.setState({
            editIndex: index,
            editText: this.state.cartoons[index].name
        });
    }

    handleEditNameChange(event) {
        console.log('Value:', event.target.value);

        this.setState({
            editText: event.target.value
        });
    }

    updateCartoon(event) {
        event.preventDefault();
        const newCartoon = {
            id: this.state.cartoons[this.state.editIndex].id,
            name: this.state.editText,
            creator: this.state.cartoons[this.state.editIndex].creator
        };

        console.log('newCartoon:', newCartoon);
        console.log('this.state.editText:', this.state.editText);

        axios.put(`http://localhost:3001/cartoons/${newCartoon.id}`, newCartoon)
            .then(res => {
                this.setState({
                    editIndex: -1
                });
            }).catch(res => {

            });
    }

    render() {
        return (
            <Fragment>
                <form onSubmit={this.handleCreateNewCartoon.bind(this)}>
                    <input type="text" onChange={this.handleNewCartoonNameChanged.bind(this)} value={this.state.newCartoonName} placeholder="Cartoon Name" />
                    <input type="text" onChange={this.handleNewCartoonCreatorChanged.bind(this)} value={this.state.newCartoonCreator} placeholder="Creator" />
                    <input type="submit" value="Create" />
                </form>

                <h2>{this.props.title}</h2>
                <ul>
                    {
                        this.state.cartoons.map(
                            (cartoon, index) => (
                                <li key={cartoon.id} onClick={this.handleEdit.bind(this, index)}>

                                {
                                    this.state.editIndex === index ?
                                        <form onSubmit={this.updateCartoon.bind(this)}>
                                            <input value={this.state.editText} type="text" onChange={this.handleEditNameChange.bind(this)} placeholder="Name" />
                                            <input type="submit" value="Save" />
                                        </form> :
                                        <Fragment>
                                            {cartoon.name}
                                            <button onClick={() => this.handleDeleteCartoon(cartoon)}>X</button>
                                        </Fragment>
                                }

                                </li>
                            )
                        )
                    }
                </ul>
            </Fragment>
        );
    }
}