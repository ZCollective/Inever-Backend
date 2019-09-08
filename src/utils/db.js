
var exports = module.exports = {}

exports.tables = {
  content_pack: {
    name: 'content_pack',
    columns: {
      id: 'content_pack_id',
      name: 'content_pack_name',
      description: 'content_pack_description',
      keywords: 'content_pack_keywords',
      min_age: 'content_pack_min_age',
      version: 'content_pack_version'
    }
  },
  proposals: {
    name: 'proposals',
    columns: {
      id: 'proposals_id',
      string: 'proposal_string',
      sender: 'proposal_sender_name',
      date: 'proposal_entry_date'
    }
  },
  question: {
    name: 'question',
    columns: {
      id: 'question_id',
      string: 'question_string',
      content_pack_id_fk: 'content_pack_id_fk'
    }
  },
  role: {
    name: 'role',
    columns: {
      id: 'role_id',
      name: 'role_name',
      description: 'role_description'
    }
  },
  user: {
    name: 'user',
    columns: {
      id: 'user_id',
      email: 'user_email',
      password: 'user_password',
      username: 'user_username',
      role_id_fk: 'user_role_id_fk'
    }
  }
}
