import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import api from '../api/client';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type FormData = z.infer<typeof schema>;

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-700);
  display: flex;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-200);
  border-radius: 4px;

  &.error {
    border-color: var(--danger);
  }
`;

const ErrorText = styled.p`
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CandidateFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCandidate = async () => {
        try {
          const response = await api.get(`/candidates/${id}`);
          reset(response.data);
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      };

      void fetchCandidate();
    }
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await api.put(`/candidates/${id}`, data);
      } else {
        await api.post('/candidates', data);
      }
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || 'Something went wrong');
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </BackButton>
        <h1>{isEdit ? 'Edit Candidate' : 'New Candidate'}</h1>
      </Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>First Name</Label>
          <Input
            {...register('firstName')}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Last Name</Label>
          <Input
            {...register('lastName')}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <ErrorText>{errors.lastName.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            {...register('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Phone</Label>
          <Input
            {...register('phone')}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
        </FormGroup>

        {serverError && <ErrorText style={{ marginBottom: '1rem' }}>{serverError}</ErrorText>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          <Save size={20} />
          {isSubmitting ? 'Saving...' : 'Save Candidate'}
        </SubmitButton>
      </form>
    </Container>
  );
};

export default CandidateFormPage;
