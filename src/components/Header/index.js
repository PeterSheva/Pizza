import React from 'react';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      name: '',
    };
  }

  addChef = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/chefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
      }),
    });

    const chef = await response.json();

    this.setState({ name: '', visible: false });

    this.props.addChefDispatch({ ...chef, dishes: [] });
  };

  render() {
    return (
      <div className="header">
        <h1 className="header__title">Ресторан "Кайф"</h1>
        <Popover
          content={
            <form>
              <input
                className="form__input"
                placeholder="Имя"
                value={this.state.name}
                onChange={({ target: { value } }) =>
                  this.setState({ ...this.state, name: value })
                }
              />
              <button className="form__button" onClick={(e) => this.addChef(e)}>
                Добавить
              </button>
            </form>
          }
          title="Повар"
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={(visible) => this.setState({ visible })}
        >
          <button className="header__button">Добавить</button>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chefs: state.chefs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addChefDispatch: (info) => dispatch({ type: 'ADD_CHEF', payload: info }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
