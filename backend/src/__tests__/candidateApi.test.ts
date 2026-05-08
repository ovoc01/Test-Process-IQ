import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Candidate from '../models/Candidate';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET || 'supersecretkey');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Candidate.deleteMany({});
});

describe('Candidate API Integration', () => {
  const candidateData = {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    phone: '0987654321',
  };

  it('should create a candidate (POST /api/candidates)', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send(candidateData);

    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Alice');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('should fail creation with invalid data', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'A' }); // Too short

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('should get all candidates (GET /api/candidates)', async () => {
    await Candidate.create(candidateData);

    const res = await request(app)
      .get('/api/candidates')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.candidates.length).toBe(1);
    expect(res.body.total).toBe(1);
  });

  it('should get a candidate by id (GET /api/candidates/:id)', async () => {
    const candidate = await Candidate.create(candidateData);

    const res = await request(app)
      .get(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Alice');
  });

  it('should update a candidate (PUT /api/candidates/:id)', async () => {
    const candidate = await Candidate.create(candidateData);

    const res = await request(app)
      .put(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Alicia' });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Alicia');
  });

  it('should soft delete a candidate (DELETE /api/candidates/:id)', async () => {
    const candidate = await Candidate.create(candidateData);

    const res = await request(app)
      .delete(`/api/candidates/${candidate._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    const found = await Candidate.findById(candidate._id);
    expect(found).toBeNull(); // Because of the find middleware
    
    // Check raw data directly in MongoDB to bypass Mongoose middleware
    const raw = await mongoose.connection.db!.collection('candidates').findOne({ _id: candidate._id });
    expect(raw?.isDeleted).toBe(true);
  });

  it('should initiate validation (POST /api/candidates/:id/validate)', async () => {
    const candidate = await Candidate.create(candidateData);

    const res = await request(app)
      .post(`/api/candidates/${candidate._id}/validate`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(202);
    expect(res.body.message).toBe('Validation in progress');
  });
});
