CREATE TABLE `users`
(
  `id` int PRIMARY KEY,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `date_of_birth` datetime,
  `admin` boolean,
  `created_at` timestamp
);

CREATE TABLE `files`
(
  `id` int PRIMARY KEY,
  `file` mediumblob COMMENT 'Max 16MB',
  `size` int,
  `filename` varchar(255),
  `encoding` varchar(255),
  `mimetype` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `posts`
(
  `id` int PRIMARY KEY,
  `user_id` int,
  `description` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `post_has_images`
(
  `post_id` int PRIMARY KEY,
  `img_id` int PRIMARY KEY,
  `created_at` timestamp
);

CREATE TABLE `post_comments`
(
  `id` int PRIMARY KEY,
  `post_id` int,
  `user_id` int,
  `comment` text,
  `created_at` timestamp
);

CREATE TABLE `post_has_likes`
(
  `post_id` int PRIMARY KEY,
  `user_id` int PRIMARY KEY,
  `created_at` timestamp
);

CREATE TABLE `user_has_friends`
(
  `user_id` int PRIMARY KEY,
  `friend_id` int PRIMARY KEY,
  `created_at` timestamp
);

CREATE TABLE `user_profile_pics`
(
  `user_id` int PRIMARY KEY,
  `img_id` int PRIMARY KEY,
  `created_at` timestamp
);

CREATE TABLE `conversations`
(
  `id` int PRIMARY KEY,
  `creator_id` int,
  `created_at` timestamp
);

CREATE TABLE `conversation_has_participants`
(
  `conversation_id` int PRIMARY KEY,
  `user_id` int PRIMARY KEY,
  `created_at` timestamp
);

CREATE TABLE `messages`
(
  `id` int PRIMARY KEY,
  `conversation_id` int,
  `user_id` int PRIMARY KEY,
  `message` text,
  `created_at` timestamp
);

ALTER TABLE `posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `post_has_images` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `post_has_images` ADD FOREIGN KEY (`img_id`) REFERENCES `files` (`id`);

ALTER TABLE `post_comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `post_comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `post_has_likes` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `post_has_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_has_friends` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_has_friends` ADD FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_profile_pics` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `files` ADD FOREIGN KEY (`id`) REFERENCES `user_profile_pics` (`img_id`);

ALTER TABLE `conversations` ADD FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`);

ALTER TABLE `conversation_has_participants` ADD FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

ALTER TABLE `conversation_has_participants` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
