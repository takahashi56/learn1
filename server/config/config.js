module.exports = {
	development: {
		db: 'mongodb://5woody:gb88200gtx@ds029575.mlab.com:29575/learningdb',
		auth0_secret: 'fLazuOMz74H5aO4Wb4G5tXnREGvrkCUwSf0JHZ6IzDHZhHRMUMG6cAukHtS1ivVG',
		auth0_client_id: 'dnrHEOwxpNGG3CyCxB9GABXvIPIlFHXp',
		postmark_api: "17c11810-aceb-45b6-8495-35dad3962dde",
		stripe_secret_key:"sk_test_kDMCSHs3rjNp8L2v7ay8JptV",
		stripe_publish_key: "pk_test_We45bLO76vdmkYnW7Lr5KIpa",
		// gc_access_token: "sandbox_IkadxYNoWa7DdXR9l1fMbnlb34c4yGHGlxZmZ48t"
		gc_access_token: "live_BLS8JVxjAY5eogFLoGZ0gf79PrkWOznePeQBQZuj"

	},
	production: {
		db: 'mongodb://5woody:gb88200gtx@ds029575.mlab.com:29575/learningdb',
		auth0_secret: 'fLazuOMz74H5aO4Wb4G5tXnREGvrkCUwSf0JHZ6IzDHZhHRMUMG6cAukHtS1ivVG',
		auth0_client_id: 'dnrHEOwxpNGG3CyCxB9GABXvIPIlFHXp',
		postmark_api: "17c11810-aceb-45b6-8495-35dad3962dde",
		stripe_secret_key:"sk_test_kDMCSHs3rjNp8L2v7ay8JptV",
		stripe_publish_key: "pk_test_We45bLO76vdmkYnW7Lr5KIpa",
		gc_access_token: "live_J82lr2L4SiqEkJa-4OXrbhzJpgJLPMpfbL-bpp1h"
		// stripe_secret_key:"sk_live_QVKra5nMQr2TJYdXhMJcbNTC",
		// stripe_publish_key: "pk_live_kulwOyBO4GDdhpbRrRg9Eiof"
	}
}
