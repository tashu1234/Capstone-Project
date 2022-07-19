import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";
const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [groceryitem, setName] = useState("");
  const [line, setLine] = useState(false);

  const [ispurchased, setpurchased] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const handleAdditem = () => {
    fetch("http://localhost:3002/grocery/add", {
      method: "POST",
      body: JSON.stringify({ groceryitem, isPurchased: false }),
      headers: {
        "Content-type": "application/json: charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((dt) => {
        alert("Post Successfully");
      });
  };
  async function getProducts() {
    //console.log(id);
    const put = await fetch("http://localhost:3002/grocery/getall");
    put = await put.json();
    setName(put);
  }

  const handlePurchaseItem = (id) => {
    setLine(true);
    console.log(id);
    fetch("http://localhost:grocery/updatePurchaseStatus/" + id, {
      method: "PUT",
      body: JSON.stringify({ id }),
      headers: {
        "Content-type": "application/json: charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((dt) => {
        alert("Updated");
        getProducts();
      });
    const removeProduct = async (id) => {
      console.log(id);
      fetch("http://localhost:3002/grocery/deleteGroceryItem/" + id, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((dt) => {
          alert("Successfully Grocery deleted");
          getProducts();
        });
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groceryitem) {
      showAlert(true, "danger", "please enter value");
    } else if (groceryitem && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: groceryitem };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item added to the list");
      const newItem = {
        id: new Date().getTime().toString(),
        title: groceryitem,
      };

      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && (
          <Alert {...alert} removerAlert={showAlert} list={list} />
        )}

        <h3>Add Shopping Item</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={groceryitem}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={() => handleAdditem(groceryitem)}
            type="Purchase"
            className="Purchase-btn"
          >
            {isEditing ? "edit" : "Purchase"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <td style={{ textDecoration: line ? "line-through" : "none" }}>
            {groceryitem.groceryItem}
          </td>

          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear List
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
