import styled from 'styled-components';

export const GridWrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${props => props.dashboard ? 4 : (props.admin ? 3 : 2)}, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  grid-auto-flow: dense;

  ${props => props.dashboard && `
    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1100px) {
      grid-template-columns: repeat(2, 1fr);
    }
  `}

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > div {
      margin-bottom: 20px;
    }
  }
`;

export const GridCell = styled.div`
  ${props => props.fullWidth && `
    grid-column: 1 / span 2;
  `}

  ${props => props.span2 && `
    grid-column: 1 / span 2;
  `}

  ${props => props.span3 && `
    grid-column: 1 / span 3;
  `}
`;