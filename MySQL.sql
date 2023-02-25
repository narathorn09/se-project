CREATE TABLE member (
    mem_id int AUTO_INCREMENT,
    mem_type varchar(2),
    mem_username varchar(50),
    mem_password varchar(255),
    PRIMARY KEY (mem_id)
);

CREATE TABLE customer (
    cust_id int AUTO_INCREMENT,
    mem_id int,
    cust_name varchar(50),
    cust_Lname varchar(50),
    cust_tel varchar(50),
    cust_email varchar(50),
    cust_photo varchar(50),
    PRIMARY KEY (cust_id),
    FOREIGN KEY (mem_id) REFERENCES member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ownerstore (
    owner_id int AUTO_INCREMENT,
    mem_id int,
    owner_name varchar(50),
    ower_Lname varchar(50),
    owner_tel varchar(50),
    owner_email varchar(50),
    owner_photo varchar(50),
    PRIMARY KEY (owner_id),
    FOREIGN KEY (mem_id) REFERENCES member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE store (
    store_id int AUTO_INCREMENT,
    mem_id int,
    store_name varchar(50),
    store_details varchar(100),
    store_religion varchar(2),
    PRIMARY KEY (store_id),
    FOREIGN KEY (mem_id) REFERENCES member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE menu (
    menu_id int AUTO_INCREMENT,
    store_id int,
    menu_name varchar(50),
    menu_price int,
    menu_photo varchar(50),
    PRIMARY KEY (menu_id),
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id int AUTO_INCREMENT,
    cust_id int,
    store_id int,
    order_status varchar(20),
    order_price int,
    order_qwaiting int,
    order_cookingstatus varchar(20),
    PRIMARY KEY (order_id),
    FOREIGN KEY (cust_id) REFERENCES customer(cust_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE orderdetail (
    order_id int,
    menu_id int,
    menu_amount int,
    menu_type varchar(10),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON UPDATE CASCADE ON DELETE CASCADE
);