import { Popover } from 'antd';
import { DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'react-redux';
import './Chef.css';

class Chef extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      dishName: '',
    };
  }

  addDish = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chefId: this.props.id,
        dishName: this.state.dishName,
      }),
    });

    const dish = await response.json();

    this.props.assDishDispatch({
      _id: dish._id,
      chef: this.props.id,
      name: dish.dishName,
    });

    this.setState({ dishName: '', visible: false });
  };

  onDelete = async (_id) => {
    const response = await fetch('http://localhost:3000/dishes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id,
      }),
    });

    const deletedDish = await response.json();

    this.props.deleteDishDispatch(deletedDish);
  };

  onMove = async (_id, direction) => {
    let targetChefIndex;

    if (direction === 'left') {
      targetChefIndex = this.props.index - 1;
    } else {
      targetChefIndex = this.props.index + 1;
    }

    const response = await fetch(`http://localhost:3000/dishes/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chefId: this.props.chefs[targetChefIndex]._id,
      }),
    });

    const updatedDish = await response.json();

    this.props.moveDishDispatch(updatedDish);
  };

  render() {
    return (
      <div className="chef">
        <p className="chef__name">{this.props.name}</p>
        <div className="chef__list">
          {this.props.dishes.map((dish) => (
            <div key={dish._id} className="dish">
              {dish.name}
              <div className="dish__icons">
                {!this.props.left && (
                  <LeftOutlined onClick={() => this.onMove(dish._id, 'left')} />
                )}
                <DeleteOutlined onClick={() => this.onDelete(dish._id)} />
                {!this.props.right && (
                  <RightOutlined
                    onClick={() => this.onMove(dish._id, 'right')}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <Popover
          content={
            <form>
              <input
                className="form__input"
                placeholder="Название"
                value={this.state.dishName}
                onChange={({ target: { value } }) =>
                  this.setState({ ...this.state, dishName: value })
                }
              />
              <button className="form__button" onClick={(e) => this.addDish(e)}>
                Добавить
              </button>
            </form>
          }
          title="Блюдо"
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={(visible) => this.setState({ visible })}
        >
          <button className="chef__button">Добавить блюдо</button>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({ chefs }) => ({ chefs });

const mapDispatchToProps = (dispatch) => ({
  assDishDispatch: (dishInfo) =>
    dispatch({ type: 'ADD_DISH', payload: dishInfo }),
  deleteDishDispatch: (dishInfo) =>
    dispatch({ type: 'DELETE_DISH', payload: dishInfo }),
  moveDishDispatch: (dishInfo) =>
    dispatch({ type: 'MOVE_DISH', payload: dishInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chef);
