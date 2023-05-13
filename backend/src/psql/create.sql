---hello
--- hashes use argon2id

--administrasi
CREATE TABLE IF NOT EXISTS adminacc(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    passwordhash TEXT NOT NULL,
    authority INT NOT NULL DEFAULT 0,
    blocked BOOLEAN NOT NULL DEFAULT FALSE
);
---forum
CREATE TABLE IF NOT EXISTS forum(
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    tags TEXT NOT NULL,
    mdcontent TEXT NOT NULL,
    tscreate TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forumwrite(
    id BIGSERIAL PRIMARY KEY,
    writer INT8 REFERENCES adminacc(id),
    forum INT8 REFERENCES forum(id),
    tsupdate TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--payment log 
CREATE TABLE IF NOT EXISTS paymentlog(
    id BIGSERIAL PRIMARY KEY,
    origin TEXT NOT NULL,
    target TEXT NOT NULL,
    nominal INT8 NOT NULL,
    paytype TEXT NOT NULL,
    descr TEXT NOT NULL,
    tsexec TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--aplikasi

---account 
CREATE TABLE IF NOT EXISTS account(
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    passwordhash TEXT,
    phone TEXT NOT NULL,
    tsjoin TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    isconsultant BOOLEAN NOT NULL DEFAULT FALSE,
    avataruri TEXT DEFAULT NULL,
    blockeduntil TIMESTAMPTZ DEFAULT NULL,
    tsswitchtype TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS accountresource(
    account INT8 REFERENCES account(id),
    uri TEXT NOT NULL,
    tscreate TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (account,uri)
);

---UMKM
CREATE TABLE IF NOT EXISTS umkm(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    passwordhash TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    tsjoin TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    avataruri TEXT NOT NULL,
    address TEXT NOT NULL,
    fundingform TEXT NOT NULL,
    objective TEXT NOT NULL,
    blockeduntil TIMESTAMPTZ DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS umkmresource(
    umkm INT8 REFERENCES umkm(id),
    uri TEXT NOT NULL,
    isgallery BOOLEAN NOT NULL DEFAULT FALSE,
    tscreate TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (umkm,uri)
);

---investasi
CREATE TABLE IF NOT EXISTS investasi( 
    investor INT8 NOT NULL REFERENCES account(id),
    investee INT8 NOT NULL REFERENCES umkm(id),
    tsinvestasi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nominal INT8 NOT NULL,
    equity FLOAT8 NOT NULL CHECK (0 <= equity AND equity <= 1),
    tsactiveinvestor TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tsactiveinvestee TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (investor, investee)
);
CREATE TABLE IF NOT EXISTS investmentmessage(
    id BIGSERIAL PRIMARY KEY,
    isclient BOOLEAN NOT NULL,
    message TEXT NOT NULL,
    tsmessage TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    investor INT8 NOT NULL, --REFERENCES investasi.investor
    investee INT8 NOT NULL,
    FOREIGN KEY (investor, investee) REFERENCES investasi (investor, investee)
);

---expertise
CREATE TABLE IF NOT EXISTS expertise(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS expertisekonsultan(
    konsultan INT8 NOT NULL REFERENCES account(id),
    expertise INT8 NOT NULL REFERENCES expertise(id),
    tsupdate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (konsultan, expertise)
);

---konsultasi
CREATE TABLE IF NOT EXISTS konsultasi(
    title TEXT NOT NULL,
    client INT8 NOT NULL REFERENCES account(id),
    consultant INT8 NOT NULL REFERENCES account(id),
    nominal INT8 NOT NULL,
    tsactiveclient TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tsactiveconsultant TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (client, consultant)--FOREIGN KEY (client, consultant) REFERENCES account (client, consultant)
);
CREATE TABLE IF NOT EXISTS consultationrating(
    client INT8 NOT NULL REFERENCES account(id),
    consultant INT8 NOT NULL REFERENCES account(id),
    rating FLOAT8 NOT NULL,
    tsrating TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (client, consultant)
);
CREATE TABLE IF NOT EXISTS consultationoffer(
    account INT8 REFERENCES account(id),
    expertise INT8 REFERENCES expertise(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    nominal INT8 NOT NULL,
    duration INT8 NOT NULL,
    tscreate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account, expertise) 
);
CREATE TABLE IF NOT EXISTS consultationmessage(
    id BIGSERIAL PRIMARY KEY,
    isclient BOOLEAN NOT NULL,
    message TEXT NOT NULL,
    tsmessage TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client INT8 NOT NULL,
    consultant INT8 NOT NULL,
    FOREIGN KEY (client, consultant) REFERENCES konsultasi (client, consultant)
);
