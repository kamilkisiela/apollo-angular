import casual from 'casual-browserify';

export const schema = [`
type Email {
  address: String
  verified: Boolean
}
type User {
  emails: [Email]
  firstName: String
  lastName: String
}
type Query {
  users: [User]
}
schema {
  query: Query
}
`];

casual.define('user', () => {
	return {
		firstName: casual.first_name,
		lastName: casual.last_name,
    emails: [{
      address: casual.email,
      verified: true,
    }]
	};
});

export const resolvers = {
  Query: {
    users(root, args) {
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push(casual.user);
      }
      return data;
    },
  },
  User: {
    emails: () => casual.user.emails,
    firstName: () => casual.user.firstName,
    lastName: () => casual.user.lastName,
  }
}
