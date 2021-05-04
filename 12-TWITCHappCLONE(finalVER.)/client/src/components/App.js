//1028089326207-k976bbgtvpsdv3ch2nf3filhg5lfcpds.apps.googleusercontent.com
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';//use LINK in plACE of ancor tag
import StreamCreate from './streams/StreamCreate';//we have used SWITCH in recent line to remove yhe problem of streamshow page appearing on createstream page
import StreamEdit from './streams/StreamEdit';
import StreamDelete from './streams/StreamDelete';
import StreamShow from './streams/StreamShow';
import StreamList from './streams/StreamList';
import Header from './Header';
import history from '../history';



const App = () => {
    return(
        <div className='ui container'>
          <Router history={history}>
            <div>
                <Header />
                <Switch>
                <Route path='/' exact component={StreamList} />
                <Route path='/streams/new' exact component={StreamCreate} />
                <Route path='/streams/edit/:id' exact component={StreamEdit} />
                <Route path='/streams/:id/delete' exact component={StreamDelete} />
                <Route path='/streams/:id' exact component={StreamShow} />
                </Switch>
            </div>
          </Router>
        </div>
    );
};

export default App;