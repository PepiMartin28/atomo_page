from src.services.db import db
from src.apps.employees.models import StateEmployee, EmployeeState

def set_employee_state(employee, state_name):
    state = StateEmployee.query.filter_by(state_name=state_name).first()
    if not state:
        return False
    employee_state = EmployeeState(
        employee_id=employee.employee_id,
        stateEmployee_id=state.stateEmployee_id
    )
    db.session.add(employee_state)
    db.session.commit()  
    return True