--- hashes use argon2id

---account 
CREATE TABLE account(
    id BIGSERIAL PRIMARY KEY,
    class CHARACTER NOT NULL DEFAULT 'I' CHECK (class in ('I','C','U')),
    isadmin BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL UNIQUE,
    passwordhash TEXT NOT NULL DEFAULT '',
    tsjoin TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    avataruri TEXT NOT NULL DEFAULT '',
    blockeduntil TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL DEFAULT '',
    domain TEXT NOT NULL DEFAULT '', --link to umkm website
    fundingform TEXT NOT NULL DEFAULT '',
    objective TEXT NOT NULL DEFAULT ''
);

--payment log 
CREATE TABLE IF NOT EXISTS paymentlog(
    id BIGSERIAL PRIMARY KEY,
    origin TEXT NOT NULL,
    target TEXT NOT NULL,
    nominal INT8 NOT NULL,
    taken_ratio FLOAT8 NOT NULL CHECK (0.0<=taken_ratio AND taken_ratio<=1.0), --rasio berapa banyak bagian kita
    paytype TEXT NOT NULL,
    descr TEXT NOT NULL,
    tsexec TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--report log 
CREATE TABLE IF NOT EXISTS reportlog(
    id BIGSERIAL PRIMARY KEY,
    reporter INT8 REFERENCES account(id) ON DELETE CASCADE,
    reported INT8 REFERENCES account(id) ON DELETE CASCADE,
    reporter_type_then CHARACTER NOT NULL CHECK (reporter_type_then in ('I','C','U')),
    reported_type_then CHARACTER NOT NULL CHECK (reported_type_then in ('I','C','U')),
    tsreported TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT NOT NULL
);

--aplikasi


---forum
CREATE TABLE IF NOT EXISTS forum(
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    tscreate TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forummessage(
    id BIGSERIAL PRIMARY KEY,
    forum INT8 REFERENCES forum(id) ON DELETE CASCADE,
    writer INT8 REFERENCES account(id) ON DELETE CASCADE,
    message TEXT NOT NULL DEFAULT '',
    tswrite TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accountresource(
    account INT8 REFERENCES account(id) ON DELETE CASCADE,
    uri TEXT NOT NULL, --/res/{account.id}_{uri}
    tscreate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account,uri)
);

---investasi (investor dan umkm)
CREATE TABLE IF NOT EXISTS investasi( 
    id BIGSERIAL NOT NULL UNIQUE,
    investor INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    investee INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    nominal INT8 NOT NULL, -- rp
    tsinvestasi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
    investasi_id INT8 REFERENCES investasi(id) ON DELETE CASCADE
    --investor INT8 NOT NULL, 
    --investee INT8 NOT NULL,
    --FOREIGN KEY (investor, investee) REFERENCES investasi (investor, investee)
);

---expertise
CREATE TABLE IF NOT EXISTS expertise(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expertisekonsultan(
    konsultan INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    expertise INT8 NOT NULL REFERENCES expertise(id) ON DELETE CASCADE,
    PRIMARY KEY (konsultan, expertise)
);

---konsultasi (konsultan dan umkm)
CREATE TABLE IF NOT EXISTS consultation(
    id BIGSERIAL NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    client INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE, --umkm
    consultant INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE, --konsultan
    category TEXT NOT NULL,
    nominal INT8 NOT NULL,
    tsconsultation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tsactiveclient TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tsactiveconsultant TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (client, consultant, category)--FOREIGN KEY (client, consultant) REFERENCES account (client, consultant)
);

CREATE TABLE IF NOT EXISTS consultationrating(
    client INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    consultant INT8 NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    rating FLOAT8 NOT NULL CHECK (0.0<=rating AND rating<=1.0),
    tsrating TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (client, consultant)
);

CREATE TABLE IF NOT EXISTS consultationoffer(
    id BIGSERIAL NOT NULL UNIQUE,
    account INT8 REFERENCES account(id) ON DELETE CASCADE,
    category TEXT NOT NULL,--expertise INT8 REFERENCES expertise(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    nominal INT8 NOT NULL,
    duration INT8 NOT NULL, -- seconds
    tscreate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (account, category) 
);

CREATE TABLE IF NOT EXISTS consultationmessage(
    id BIGSERIAL PRIMARY KEY,
    isclient BOOLEAN NOT NULL,
    message TEXT NOT NULL,
    tsmessage TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consultation_id INT8 NOT NULL REFERENCES consultation(id) ON DELETE CASCADE
);
