import { createStore } from 'redux';

const initialState = {
  chefs: [],
};

function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'SET_CHEFS':
      return { ...state, chefs: payload };
    case 'ADD_CHEF':
      return {
        ...state,
        chefs: [...state.chefs, payload],
      };
    case 'ADD_DISH':
      console.log(payload);
      return {
        ...state,
        chefs: state.chefs.map((chef) =>
          chef._id === payload.chef
            ? { ...chef, dishes: [...chef.dishes, payload] }
            : { ...chef }
        ),
      };
    case 'DELETE_DISH':
      return {
        ...state,
        chefs: state.chefs.map((chef) =>
          chef.dishes.some((dish) => dish._id === payload._id)
            ? {
                ...chef,
                dishes: chef.dishes.filter((dish) => dish._id !== payload._id),
              }
            : chef
        ),
      };
    case 'MOVE_DISH':
      const newChefs = state.chefs.map((chef) => {
        if (chef._id === payload.chef) {
          return {
            ...chef,
            dishes: [
              ...chef.dishes,
              { _id: payload._id, name: payload.dishName },
            ],
          };
        } else if (chef.dishes.some((dish) => dish._id === payload._id)) {
          return {
            ...chef,
            dishes: chef.dishes.filter((dish) => dish._id !== payload._id),
          };
        }

        return chef;
      });

      console.log(newChefs);

      return {
        ...state,
        chefs: newChefs,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
