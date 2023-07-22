import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';

import './app.scss';

const MainPage = lazy(() => import('../pages/MainPage.js'));
const ComicsPage = lazy(() => import('../pages/ComicsPage.js'));
const Page404 = lazy(() => import('../pages/Page404.js'));
const SingleComicPage = lazy(() => import('../pages/singleComicPage/SingleComicPage.js'));
const SingleCharPage = lazy(() => import('../pages/singleCharPage/SingleCharPage.js'));
const SinglePage = lazy(() => import('../pages/SinglePage.js'));

const App = () =>  {
    return (
            <Router>
                <div className="app">
                    <AppHeader />
                    <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                                <Route path='/' element={<MainPage />} />
                                <Route path='/comics' element={<ComicsPage />} />
                                <Route path='/comics/:id' element={<SinglePage Component={SingleComicPage} dataType='comic'/>} />
                                <Route path='/characters/:id' element={<SinglePage Component={SingleCharPage} dataType='character'/>} />
                                <Route path='*' element={<Page404 />} />
                        </Routes>
                    </Suspense>
                    </main>
                </div>
            </Router>
    );
}

export default App;
