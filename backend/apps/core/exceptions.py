"""
Exception handler for core app.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('django')

def core_exception_handler(exc, context):
    """
    Custom exception handler for the API.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Format error response
        error_data = {
            'success': False,
            'message': _get_error_message(response.data),
            'errors': response.data if isinstance(response.data, dict) else None,
        }
        return Response(error_data, status=response.status_code)

    # Handle unhandled exceptions
    logger.error(f'Unhandled exception: {exc}', exc_info=True)
    return Response({
        'success': False,
        'message': 'Ocurrió un error inesperado. Por favor contacte al administrador.',
        'errorCode': 'INTERNAL_ERROR',
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _get_error_message(data):
    """Extract error message from DRF response data."""
    if isinstance(data, dict):
        # Get first error message
        for key, value in data.items():
            if isinstance(value, list):
                return str(value[0])
            return str(value)
    elif isinstance(data, list):
        return str(data[0])
    return str(data)