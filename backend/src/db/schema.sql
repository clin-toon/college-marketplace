CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--users table creation 
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create user profile table
CREATE TABLE user_profile (
    user_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,

    full_name VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    faculty VARCHAR(100),
    semester VARCHAR(50),
    is_allowed_to_post BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- create categories table 
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create listings table 
CREATE TABLE listings (
    listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    seller_id UUID NOT NULL,
    category_id UUID NOT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,

    condition VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_listing_seller
        FOREIGN KEY (seller_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_listing_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_listing_condition
	 CHECK (condition IN ('new', 'like_new', 'good', 'used')),

    CONSTRAINT chk_listing_status
        CHECK (status IN ('active', 'sold', 'reserved', 'removed'))
);


-- create listing images  table 
CREATE TABLE listing_images (
    listing_image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_listing_image_listing
        FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON DELETE CASCADE
);

-- create favourites table 
CREATE TABLE favourites (
    favourite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    listing_id UUID NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favourite_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favourite_listing
        FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_listing_favourite
        UNIQUE (user_id, listing_id)
);


-- create contact-reqeusts table 
CREATE TABLE contact_requests (
    contact_request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contact_listing
        FOREIGN KEY (listing_id)
        REFERENCES listings(listing_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contact_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contact_receiver
        FOREIGN KEY (receiver_id)
		  REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- create notifications table 
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT,

    reference_id UUID,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- creating indexes for fast read operations 
CREATE INDEX idx_listings_seller_id
ON listings(seller_id);

CREATE INDEX idx_listings_category_id
ON listings(category_id);

CREATE INDEX idx_favourites_user_id
ON favourites(user_id);

CREATE INDEX idx_favourites_listing_id
ON favourites(listing_id);

CREATE INDEX idx_contact_requests_listing_id
ON contact_requests(listing_id);

CREATE INDEX idx_contact_requests_sender_id
ON contact_requests(sender_id);

CREATE INDEX idx_contact_requests_receiver_id
ON contact_requests(receiver_id);

CREATE INDEX idx_notifications_user_id
ON notifications(user_id);



