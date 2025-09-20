const pool = require('../config/database');

class ChartOfAccount {
  static async create({ account_name, account_type, description }) {
    const result = await pool.query(
      'INSERT INTO chart_of_accounts (account_name, account_type, description) VALUES ($1, $2, $3) RETURNING *',
      [account_name, account_type, description]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM chart_of_accounts ORDER BY account_type, account_name'
    );
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM chart_of_accounts WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { account_name, account_type, description }) {
    const result = await pool.query(
      'UPDATE chart_of_accounts SET account_name = $1, account_type = $2, description = $3 WHERE id = $4 RETURNING *',
      [account_name, account_type, description, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM chart_of_accounts WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByType(account_type) {
    const result = await pool.query(
      'SELECT * FROM chart_of_accounts WHERE account_type = $1 ORDER BY account_name',
      [account_type]
    );
    
    return result.rows;
  }
  
  static async getAssets() {
    return await this.getByType('Asset');
  }
  
  static async getLiabilities() {
    return await this.getByType('Liability');
  }
  
  static async getIncome() {
    return await this.getByType('Income');
  }
  
  static async getExpenses() {
    return await this.getByType('Expense');
  }
  
  static async getEquity() {
    return await this.getByType('Equity');
  }
  
  static async getWithBalances() {
    const result = await pool.query(`
      SELECT 
        coa.*,
        COALESCE(SUM(
          CASE 
            WHEN coa.account_type IN ('Asset', 'Expense') THEN lp.debit_amount - lp.credit_amount
            ELSE lp.credit_amount - lp.debit_amount
          END
        ), 0) as balance
      FROM chart_of_accounts coa
      LEFT JOIN ledger_postings lp ON coa.id = lp.account_id
      GROUP BY coa.id, coa.account_name, coa.account_type, coa.description, coa.created_at
      ORDER BY coa.account_type, coa.account_name
    `);
    
    return result.rows;
  }
}

module.exports = ChartOfAccount;

