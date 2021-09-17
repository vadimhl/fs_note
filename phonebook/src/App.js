import React, { useState, useEffect } from 'react'
import personsServ from './services/persons'
import './App.css';

const Confirm = ({ text, ok, cancel }) => {
    if (!text) return null;
    console.log('ok=', ok);
    const style = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    return (
        <div style={style}>
            {text} <button onClick={ok}>Ok</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    )
}

const Message = ({ message, setMessage }) => {
    const { text, color, time } = message;
    if (text) {
        const style = {
            color: color,
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
        }
        if (time) {
            setTimeout(() => { setMessage({ text: '', color: 'gray', time: 0 }) }, time)
        }
        return (
            <div style={style}>
                {text}
            </div>
        )
    }
    return null;
}
const Inp = ({ text, val, onChange, id }) => (
    <p>
        <label htmlFor={text}>{text}:</label>  <input value={val} onChange={onChange} id={text} />
    </p>
)

const Filter = ({ filter, onFilterChange }) => {
    return (
        <div>
            <Inp text='Filter' val={filter} onChange={onFilterChange} />
            <button onClick={() => onFilterChange({ target: { value: '' } })}>clear</button>
        </div>
    )
}

const PersonForm = ({ newName, newNumber, onSubmit, onPersonChange, onNumberChange }) => {
    return (
        <form onSubmit={onSubmit}>
            <Inp text='name' val={newName} onChange={onPersonChange} />
            <Inp text='number' val={newNumber} onChange={onNumberChange} />
            <div>
                <button type="submit" >add</button>
            </div>
        </form>
    )
}
const Persons = ({ personsToShow, toDel }) => {
    return (
        <ul>
            {personsToShow.map(person =>
                <li key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => toDel(person.id, person.name)}>del</button>
                </li>)}
        </ul>
    )
}
const App = (props) => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState({ text: '', color: 'gray', time: 0 });
    const [confirmText, setConfirmText] = useState('');
    const [confirmFunc, setConfirmFunc] = useState(() => () => { });

    const hook = () => { personsServ.getAll().then(dat => setPersons(dat)) }
    useEffect(hook, [])

    const addPerson = event => {
        event.preventDefault();
        if (!persons.every(person => person.name !== newName)) {
            if (window.confirm(`${newName} is already added to phonebook, replace?`)) {
                const person = { ...persons.find(person => person.name === newName), number: newNumber };
                personsServ.update(person).then((person => {
                    setPersons(persons.map(p => p.id === person.id ? person : p));
                    setNewName('');
                    setNewNumber('');

                }));
            }
        } else {
            const person = { name: newName, number: newNumber };
            personsServ.addNew(person).then(person => {
                setPersons(persons.concat(person));
                setNewName('');
                setNewNumber('');
                setMessage({ text: `Added ${person.name}`, color: 'green', time: 5000 });
            })
        }
    }
    const delPerson = (id, name) => {
        setConfirmFunc(() => () => { delPerson1(id, name); setConfirmText('') });
        setConfirmText(`Delete ${name}?`);
    }
    const delPerson1 = (id, name) => {
        personsServ.del(id)
            .then(() =>
                setMessage({
                    text: `Information of ${name} has been removed from server`,
                    color: 'green',
                    time: 5000
                })
            )
            .catch(() =>
                setMessage({
                    text: `Information of ${name} has alredy been removed from server`,
                    color: 'red',
                    time: 5000
                })
            )
            .finally(() => personsServ.getAll().then(dat => setPersons(dat)))
    }

    const onPersonChange = event => setNewName(event.target.value);
    const onNumberChange = event => setNewNumber(event.target.value);
    const onFilterChange = event => setFilter(event.target.value.toLowerCase());
    const personsToShow = filter === '' ? persons :
        persons.filter(person => person.name.toLowerCase().includes(filter));

    return (
        <div>
            <h2>Phonebook</h2>
            <Confirm
                text={confirmText}
                ok={confirmFunc}
                cancel={() => setConfirmText('')}
            />
            <Message
                message={message}
                setMessage={setMessage}
            />
            <Filter filter={filter} onFilterChange={onFilterChange} />
            <hr />
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                onSubmit={addPerson}
                onPersonChange={onPersonChange}
                onNumberChange={onNumberChange}
            />
            <hr />
            <h2>Numbers: </h2>
            <Persons personsToShow={personsToShow} toDel={delPerson} />
        </div>
    )
}

export default App