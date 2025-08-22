"""Fleet Management Schema Updates

Revision ID: fleet_management_v1
Revises: 61830da46ae7
Create Date: 2025-01-22 11:20:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fleet_management_v1'
down_revision = '61830da46ae7'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to trucks table
    op.add_column('trucks', sa.Column('make', sa.String(100), nullable=True))
    op.add_column('trucks', sa.Column('model', sa.String(100), nullable=True))
    op.add_column('trucks', sa.Column('year', sa.Integer(), nullable=True))
    op.add_column('trucks', sa.Column('capacity_volume', sa.Float(), nullable=True))
    op.add_column('trucks', sa.Column('capacity_weight', sa.Float(), nullable=True))
    op.add_column('trucks', sa.Column('fuel_type', sa.String(50), nullable=True))
    op.add_column('trucks', sa.Column('fuel_efficiency', sa.Float(), nullable=True))
    op.add_column('trucks', sa.Column('last_maintenance', sa.DateTime(timezone=True), nullable=True))
    op.add_column('trucks', sa.Column('next_maintenance', sa.DateTime(timezone=True), nullable=True))
    op.add_column('trucks', sa.Column('total_miles', sa.Float(), nullable=True, server_default='0.0'))
    op.add_column('trucks', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('trucks', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    
    # Add new columns to shipments table
    op.add_column('shipments', sa.Column('priority', sa.String(20), nullable=False, server_default='normal'))
    op.add_column('shipments', sa.Column('cargo_type', sa.String(100), nullable=True))
    op.add_column('shipments', sa.Column('cargo_weight', sa.Float(), nullable=True))
    op.add_column('shipments', sa.Column('cargo_volume', sa.Float(), nullable=True))
    op.add_column('shipments', sa.Column('pickup_time', sa.DateTime(timezone=True), nullable=True))
    op.add_column('shipments', sa.Column('delivery_deadline', sa.DateTime(timezone=True), nullable=True))
    op.add_column('shipments', sa.Column('assigned_truck_id', sa.Integer(), nullable=True))
    op.add_column('shipments', sa.Column('assigned_driver_id', sa.Integer(), nullable=True))
    op.add_column('shipments', sa.Column('route_id', sa.Integer(), nullable=True))
    op.add_column('shipments', sa.Column('route_distance', sa.Float(), nullable=True))
    op.add_column('shipments', sa.Column('estimated_fuel_cost', sa.Float(), nullable=True))
    op.add_column('shipments', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    
    # Create maintenance_records table
    op.create_table('maintenance_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('truck_id', sa.Integer(), nullable=False),
        sa.Column('maintenance_type', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('cost', sa.Float(), nullable=True),
        sa.Column('performed_by', sa.String(255), nullable=True),
        sa.Column('performed_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('next_maintenance_due', sa.DateTime(timezone=True), nullable=True),
        sa.Column('mileage_at_service', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['truck_id'], ['trucks.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_maintenance_records_id'), 'maintenance_records', ['id'], unique=False)
    
    # Create fuel_records table
    op.create_table('fuel_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('truck_id', sa.Integer(), nullable=False),
        sa.Column('fuel_amount', sa.Float(), nullable=False),
        sa.Column('fuel_cost', sa.Float(), nullable=False),
        sa.Column('total_cost', sa.Float(), nullable=False),
        sa.Column('mileage_at_fueling', sa.Float(), nullable=True),
        sa.Column('fuel_station', sa.String(255), nullable=True),
        sa.Column('fuel_type', sa.String(50), nullable=True),
        sa.Column('fueled_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['truck_id'], ['trucks.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fuel_records_id'), 'fuel_records', ['id'], unique=False)
    
    # Create routes table
    op.create_table('routes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('origin', sa.String(255), nullable=False),
        sa.Column('destination', sa.String(255), nullable=False),
        sa.Column('waypoints', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('estimated_distance', sa.Float(), nullable=True),
        sa.Column('estimated_time', sa.Integer(), nullable=True),
        sa.Column('fuel_efficiency', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_routes_id'), 'routes', ['id'], unique=False)
    
    # Add foreign key constraints
    op.create_foreign_key('fk_shipments_assigned_truck', 'shipments', 'trucks', ['assigned_truck_id'], ['id'])
    op.create_foreign_key('fk_shipments_assigned_driver', 'shipments', 'users', ['assigned_driver_id'], ['id'])
    op.create_foreign_key('fk_shipments_route', 'shipments', 'routes', ['route_id'], ['id'])


def downgrade():
    # Remove foreign key constraints
    op.drop_constraint('fk_shipments_route', 'shipments', type_='foreignkey')
    op.drop_constraint('fk_shipments_assigned_driver', 'shipments', type_='foreignkey')
    op.drop_constraint('fk_shipments_assigned_truck', 'shipments', type_='foreignkey')
    
    # Drop routes table
    op.drop_index(op.f('ix_routes_id'), table_name='routes')
    op.drop_table('routes')
    
    # Drop fuel_records table
    op.drop_index(op.f('ix_fuel_records_id'), table_name='fuel_records')
    op.drop_table('fuel_records')
    
    # Drop maintenance_records table
    op.drop_index(op.f('ix_maintenance_records_id'), table_name='maintenance_records')
    op.drop_table('maintenance_records')
    
    # Remove columns from shipments table
    op.drop_column('shipments', 'updated_at')
    op.drop_column('shipments', 'estimated_fuel_cost')
    op.drop_column('shipments', 'route_distance')
    op.drop_column('shipments', 'route_id')
    op.drop_column('shipments', 'assigned_driver_id')
    op.drop_column('shipments', 'assigned_truck_id')
    op.drop_column('shipments', 'delivery_deadline')
    op.drop_column('shipments', 'pickup_time')
    op.drop_column('shipments', 'cargo_volume')
    op.drop_column('shipments', 'cargo_weight')
    op.drop_column('shipments', 'cargo_type')
    op.drop_column('shipments', 'priority')
    
    # Remove columns from trucks table
    op.drop_column('trucks', 'updated_at')
    op.drop_column('trucks', 'created_at')
    op.drop_column('trucks', 'total_miles')
    op.drop_column('trucks', 'next_maintenance')
    op.drop_column('trucks', 'last_maintenance')
    op.drop_column('trucks', 'fuel_efficiency')
    op.drop_column('trucks', 'fuel_type')
    op.drop_column('trucks', 'capacity_weight')
    op.drop_column('trucks', 'capacity_volume')
    op.drop_column('trucks', 'year')
    op.drop_column('trucks', 'model')
    op.drop_column('trucks', 'make')
