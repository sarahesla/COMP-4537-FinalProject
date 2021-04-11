CREATE TABLE IF NOT EXISTS admin(
    admin_id VARCHAR (100) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(511) NOT NULL,
    salt VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(admin_id)
);



CREATE TABLE IF NOT EXISTS api_request(
    request_id INT NOT NULL AUTO_INCREMENT,
    admin_id VARCHAR (100) NOT NULL,
    endpoint VARCHAR (100) NOT NULL,
    request_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(request_id),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE IF NOT EXISTS user(
    user_id VARCHAR (100) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(511) NOT NULL,
    salt VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS ledger(
    ledger_id VARCHAR (100) NOT NULL UNIQUE,
    ledger_name VARCHAR (100) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(ledger_id),
    FOREIGN KEY (created_by) REFERENCES user(user_id)
);



CREATE TABLE IF NOT EXISTS ledger_user(
    ledger_id VARCHAR (100) NOT NULL,
    user_id VARCHAR (100) NOT NULL,
    PRIMARY KEY(ledger_id, user_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (ledger_id) REFERENCES ledger(ledger_id)
);



CREATE TABLE IF NOT EXISTS tr_ledger(
    tr_id VARCHAR (100) NOT NULL UNIQUE,
    tr_name VARCHAR(100) NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    ledger_id VARCHAR (100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(tr_id, ledger_id),
    FOREIGN KEY(ledger_id) REFERENCES ledger(ledger_id)
);