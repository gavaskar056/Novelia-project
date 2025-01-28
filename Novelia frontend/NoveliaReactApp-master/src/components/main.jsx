import React, { useEffect, useState } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import Reader from "./Reader/reader";
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateBook from './Writer/createBook';
import Login from './Login/login';
import CreateChapter from './Writer/createChapter';
import Footer from './footer';
import { Landing } from "./Landing";
import { Browse } from "./Browsing-page";
import Navbar from "./Browsing-page/Navbar";
import BookCardComp from "./BookCardBoody";
import AllBooks from './AllBooks';


function Main() {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState("");
    const [bookname, setBookName] = useStateWithCallbackLazy("");
    const [logout, setLogOut] = useState(false);

    const handleChange = (username) => {
        setLoggedIn(true);
        setUser(username);
    }

    const handleLogOut = () => {
        setLogOut(true);
    }

    useEffect(() => {
        if (logout) {
            localStorage.removeItem("user");
            setLoggedIn(false);
            setUser("");
        }
    }, [logout]);

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("user", user);
        } else {
            if (localStorage.getItem("user")) {
                setLoggedIn(true);
                setUser(localStorage.getItem("user"));
            }
        }
    }, [isLoggedIn, user]);

    return (
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={() => (
                    <div>
                        <Landing handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                    </div>
                )} />
                <Route path='/reader' component={() => (
                    <div>
                        {console.log(bookname)}
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <Reader bookName={bookname} />
                    </div>
                )} />
                <Route exact path='/login' component={() => (
                    <Login handleChangeInLogin={handleChange} />
                )} />
                <Route exact path="/bookinfo">
                    <Redirect push to={'/reader'} />
                </Route>
                <Route exact path="/createBook" component={() => (
                    <div>
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <CreateBook Author={user} />
                        <CreateChapter Author={user} />
                    </div>
                )} />
                <Route exact path="/createChapter" component={() => (
                    <div>
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <CreateChapter Author={user} />
                    </div>
                )} />
                <Route exact path="/browse" component={() => (
                    <div>
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <Browse />
                    </div>
                )} />
                <Route path="/cards" component={() => (
                    <div>
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <BookCardComp setBookName={setBookName} />
                    </div>
                )} />
                <Route exact path="/logout" >
                    {/* {setLogOut(true)} */}
                    <Redirect push to="/" />
                </Route>
                <Route exact path="/allbooks" component={() => (
                    <div>
                        <Navbar handleLogOut={handleLogOut} isLoggedIn={isLoggedIn} user={user} />
                        <AllBooks setBookName={setBookName} />
                    </div>
                )} />
                <Route exact path="/success" component={() => (
                    <h1>Successful</h1>
                )} />
                <Route exact path="/fail" component={() => (
                    <h1>Failure</h1>
                )} />
            </Switch>
            <Footer />
        </React.Fragment>
    )

}

export default Main;