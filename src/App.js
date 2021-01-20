import 'antd/dist/antd.css';
import React from 'react';
import { connect, Provider } from 'react-redux';
import './App.css';
import Header from './components/Header/';
import Main from './components/Main/';
import store from './redux';

class App extends React.Component {
  componentDidMount() {
    const getChefs = async () => {
      const response = await fetch('http://localhost:3000/chefs');
      const chefs = await response.json();

      const chefsWithDishes = await Promise.all(
        chefs.map(async (chef, index) => {
          const response = await fetch(
            `http://localhost:3000/dishes/${chef._id}`
          );

          const dishes = await response.json();

          return {
            ...chef,
            index,
            dishes: dishes.map((dish) => ({
              _id: dish._id,
              name: dish.dishName,
            })),
          };
        })
      );

      this.props.setChefsDispatch(chefsWithDishes);
    };

    getChefs();
  }

  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <Header />
          <Main />
        </div>
      </Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setChefsDispatch: (chefs) => dispatch({ type: 'SET_CHEFS', payload: chefs }),
});

export default connect(null, mapDispatchToProps)(App);
